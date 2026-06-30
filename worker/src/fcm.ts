function base64urlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlEncodeBuffer(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Convert PEM private key to CryptoKey using WebCrypto
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemBody = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const keyDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    keyDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

// Get an OAuth2 access token by signing a JWT with the service account key.
// This token is then used to authenticate calls to the FCM HTTP v1 API.
async function getOAuthToken(
  clientEmail: string,
  privateKeyPem: string
): Promise<string> {
  const privateKey = await importPrivateKey(privateKeyPem);

  const now = Math.floor(Date.now() / 1000);
  const header = base64urlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64urlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const signingInput = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${base64urlEncodeBuffer(signature)}`;

  // Exchange the signed JWT for a short-lived OAuth2 access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`OAuth token exchange failed: ${err}`);
  }

  const { access_token } = await tokenRes.json<{ access_token: string }>();
  return access_token;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;   // URL to an icon image (48x48px recommended)
  url?: string;    // URL to open when notification is clicked
}

export async function sendPushNotification(
  deviceToken: string,
  payload: PushPayload,
  projectId: string,
  clientEmail: string,
  privateKeyPem: string
): Promise<void> {
  const accessToken = await getOAuthToken(clientEmail, privateKeyPem);

  const message = {
    message: {
      token: deviceToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      webpush: {
        notification: {
          icon: payload.icon ?? '/android-icon-192x192.png',
          click_action: payload.url ?? '/',
        },
        fcm_options: {
          link: payload.url ?? '/',
        },
      },
    },
  };

  const fcmRes = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(message),
    }
  );

  if (!fcmRes.ok) {
    const err = await fcmRes.text();
    throw new Error(`FCM send failed: ${err}`);
  }
}
