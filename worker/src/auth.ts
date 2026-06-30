// Firebase ID tokens are JWTs signed by Google using RS256.
// Google publishes their public keys as JWK at this endpoint.
const FIREBASE_JWK_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

interface FirebaseClaims {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified: boolean;
}

function base64urlDecode(str: string): string {
  // Convert base64url to standard base64, then decode
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

export async function verifyFirebaseToken(
  token: string,
  projectId: string
): Promise<FirebaseClaims> {
  // 1. Split the JWT into its three parts
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const [headerB64, payloadB64, signatureB64] = parts;

  // 2. Decode header to get the key ID (kid)
  const header = JSON.parse(base64urlDecode(headerB64));
  if (header.alg !== 'RS256') throw new Error('Expected RS256 algorithm');

  // 3. Decode payload to read claims
  const payload = JSON.parse(base64urlDecode(payloadB64));

  // 4. Validate standard JWT claims
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error('Token has expired');
  if (payload.iat > now + 300) throw new Error('Token issued in the future');
  if (payload.aud !== projectId) throw new Error('Token audience mismatch');
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error('Token issuer mismatch');
  }
  if (!payload.sub) throw new Error('Token missing subject');

  // 5. Fetch Google's public keys (JWK format)
  const jwksRes = await fetch(FIREBASE_JWK_URL);
  if (!jwksRes.ok) throw new Error('Failed to fetch Google public keys');
  const { keys } = await jwksRes.json<{ keys: JsonWebKey[] }>();

  // 6. Find the key that matches the token's kid
  const jwk = (keys as (JsonWebKey & { kid: string })[]).find(
    (k) => k.kid === header.kid
  );
  if (!jwk) throw new Error('No matching public key found for kid: ' + header.kid);

  // 7. Import the public key using WebCrypto
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  // 8. Verify the JWT signature
  const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signatureBytes = Uint8Array.from(base64urlDecode(signatureB64), (c) =>
    c.charCodeAt(0)
  );
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signatureBytes,
    signingInput
  );
  if (!valid) throw new Error('Invalid JWT signature');

  // 9. Return the claims we care about
  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    email_verified: payload.email_verified,
  };
}

// ─── Session helpers ─────────────────────────────────────────────────────────

export function generateSessionId(): string {
  // 32 random bytes encoded as hex = 64-char session token
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface SessionData {
  uid: string;
  email: string;
  exp: number;
}

export async function createSession(
  kv: KVNamespace,
  uid: string,
  email: string
): Promise<string> {
  const sessionId = generateSessionId();
  const sevenDays = 7 * 24 * 60 * 60; // seconds
  const data: SessionData = {
    uid,
    email,
    exp: Math.floor(Date.now() / 1000) + sevenDays,
  };
  // Store in KV with a 7-day TTL — KV auto-deletes it after expiry
  await kv.put(`session:${sessionId}`, JSON.stringify(data), {
    expirationTtl: sevenDays,
  });
  return sessionId;
}

export async function validateSession(
  kv: KVNamespace,
  sessionId: string
): Promise<SessionData | null> {
  const raw = await kv.get(`session:${sessionId}`);
  if (!raw) return null;
  const data: SessionData = JSON.parse(raw);
  if (data.exp < Math.floor(Date.now() / 1000)) return null;
  return data;
}
