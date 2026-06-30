import {
  handleOptions,
  jsonResponse,
} from './cors';
import {
  verifyFirebaseToken,
  createSession,
  validateSession,
} from './auth';
import { sendPushNotification } from './fcm';

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  MEDIA: R2Bucket;
  FIREBASE_PROJECT_ID: string;
  ALLOWED_ORIGIN: string;
  FCM_CLIENT_EMAIL: string;
  FCM_PRIVATE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN;
    const url = new URL(request.url);

    // Handle CORS preflight — browser sends OPTIONS before POST/PUT
    if (request.method === 'OPTIONS') {
      return handleOptions(request, origin);
    }

    try {
      // ── POST /auth/login ─────────────────────────────────────────────────
      // Accepts a Firebase ID token, verifies it, creates a session.
      if (url.pathname === '/auth/login' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization') ?? '';
        const idToken = authHeader.replace('Bearer ', '').trim();
        if (!idToken) {
          return jsonResponse({ error: 'Missing Authorization header' }, 401, origin);
        }

        const claims = await verifyFirebaseToken(idToken, env.FIREBASE_PROJECT_ID);

        // Upsert user in D1 — if they exist, update last_seen; otherwise insert
        await env.DB.prepare(`
          INSERT INTO users (uid, email, display_name, photo_url)
          VALUES (?1, ?2, ?3, ?4)
          ON CONFLICT(uid) DO UPDATE SET
            email        = excluded.email,
            display_name = excluded.display_name,
            photo_url    = excluded.photo_url,
            last_seen_at = unixepoch()
        `)
          .bind(claims.uid, claims.email, claims.name ?? null, claims.picture ?? null)
          .run();

        // Create a session in KV
        const sessionToken = await createSession(env.SESSIONS, claims.uid, claims.email);

        return jsonResponse(
          {
            sessionToken,
            user: {
              uid: claims.uid,
              email: claims.email,
              name: claims.name,
              photo: claims.picture,
            },
          },
          200,
          origin
        );
      }

      // ── POST /auth/fcm-token ─────────────────────────────────────────────
      // Stores the browser's FCM device token for push notifications.
      if (url.pathname === '/auth/fcm-token' && request.method === 'POST') {
        const session = await requireSession(request, env);
        if (!session) return jsonResponse({ error: 'Unauthorized' }, 401, origin);

        const { token, userAgent } = await request.json<{
          token: string;
          userAgent?: string;
        }>();
        if (!token) return jsonResponse({ error: 'Missing token' }, 400, origin);

        await env.DB.prepare(`
          INSERT INTO device_tokens (uid, token, user_agent)
          VALUES (?1, ?2, ?3)
          ON CONFLICT(token) DO UPDATE SET
            uid        = excluded.uid,
            user_agent = excluded.user_agent,
            updated_at = unixepoch()
        `)
          .bind(session.uid, token, userAgent ?? null)
          .run();

        return jsonResponse({ ok: true }, 200, origin);
      }

      // ── GET /auth/me ─────────────────────────────────────────────────────
      // Returns the current user's profile from D1.
      if (url.pathname === '/auth/me' && request.method === 'GET') {
        const session = await requireSession(request, env);
        if (!session) return jsonResponse({ error: 'Unauthorized' }, 401, origin);

        const user = await env.DB.prepare(
          'SELECT uid, email, display_name, photo_url FROM users WHERE uid = ?1'
        )
          .bind(session.uid)
          .first();

        if (!user) return jsonResponse({ error: 'User not found' }, 404, origin);
        return jsonResponse(user, 200, origin);
      }

      // ── POST /notifications/send ─────────────────────────────────────────
      // Internal endpoint: sends a push notification to all devices of a user.
      // In production you'd protect this with an admin key or call it from a
      // trusted internal trigger — for now it requires a valid session.
      if (url.pathname === '/notifications/send' && request.method === 'POST') {
        const session = await requireSession(request, env);
        if (!session) return jsonResponse({ error: 'Unauthorized' }, 401, origin);

        const { title, body, url: clickUrl } = await request.json<{
          title: string;
          body: string;
          url?: string;
        }>();

        // Get all FCM tokens for this user
        const { results } = await env.DB.prepare(
          'SELECT token FROM device_tokens WHERE uid = ?1'
        )
          .bind(session.uid)
          .all<{ token: string }>();

        if (results.length === 0) {
          return jsonResponse({ ok: true, sent: 0 }, 200, origin);
        }

        // Send to all devices in parallel
        await Promise.allSettled(
          results.map((row) =>
            sendPushNotification(
              row.token,
              { title, body, url: clickUrl },
              env.FIREBASE_PROJECT_ID,
              env.FCM_CLIENT_EMAIL,
              env.FCM_PRIVATE_KEY
            )
          )
        );

        return jsonResponse({ ok: true, sent: results.length }, 200, origin);
      }

      return jsonResponse({ error: 'Not found' }, 404, origin);
    } catch (err) {
      console.error(err);
      return jsonResponse(
        { error: err instanceof Error ? err.message : 'Internal server error' },
        500,
        origin
      );
    }
  },
};

// ─── Helper ──────────────────────────────────────────────────────────────────

async function requireSession(
  request: Request,
  env: Env
): Promise<{ uid: string; email: string } | null> {
  const authHeader = request.headers.get('Authorization') ?? '';
  const sessionToken = authHeader.replace('Bearer ', '').trim();
  if (!sessionToken) return null;
  return validateSession(env.SESSIONS, sessionToken);
}
