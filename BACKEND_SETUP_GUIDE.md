# The Stage Time — Backend Setup Guide

> **Read the Understanding section fully before doing anything.** It explains WHY each piece exists so you are never blindly copy-pasting commands.

---

## Table of Contents

1. [Understanding the Architecture](#1-understanding-the-architecture)
2. [Phase 1 — Firebase Project Setup](#2-phase-1--firebase-project-setup)
3. [Phase 2 — Cloudflare Infrastructure Setup](#3-phase-2--cloudflare-infrastructure-setup)
4. [Phase 3 — D1 Database Schema](#4-phase-3--d1-database-schema)
5. [Phase 4 — Build the Cloudflare Worker](#5-phase-4--build-the-cloudflare-worker)
6. [Phase 5 — Frontend: Firebase Auth Integration](#6-phase-5--frontend-firebase-auth-integration)
7. [Phase 6 — Frontend: FCM Push Notifications](#7-phase-6--frontend-fcm-push-notifications)
8. [Phase 7 — Deploy and Wire Everything Together](#8-phase-7--deploy-and-wire-everything-together)

---

## Work Distribution — Who Does What?

| Phase | What | Who | Time |
|-------|------|-----|------|
| **1** | Firebase Console setup (projects, auth, keys) | **YOU** (Manual) | ~15 min |
| **2** | Cloudflare setup (Wrangler, D1, KV, R2) | YOU start, then **CLAUDE** continues | ~10 min + automated |
| **3** | Database schema creation | **CLAUDE** (Automated) | ~2 min |
| **4** | Cloudflare Worker code | **CLAUDE** (Creates all files) | ~5 min |
| **5** | Frontend Firebase setup | YOU create `.env`, **CLAUDE** creates components | ~10 min + automated |
| **6** | Frontend push notifications | YOU create service worker, **CLAUDE** creates hooks | ~10 min + automated |
| **7** | Deploy & test | YOU deploy, **CLAUDE** guides testing | ~15 min |

**Total time:** ~60–90 minutes end-to-end

---

## 1. Understanding the Architecture

Before touching any code or console, understand what each piece does and why it is there.

### Firebase Auth — Why?

You do **not** want to build your own username/password system. Firebase Auth handles the entire OAuth2 dance with Google (redirects, tokens, refresh logic, account linking). All you get at the end is a **Firebase ID Token** — a signed JWT that proves "this user is who they say they are." Your backend (Worker) reads that token and trusts it only after cryptographically verifying Google signed it.

Firebase Auth is free and handles millions of users. You keep zero passwords.

### Cloudflare Workers — Why?

Your React app runs in the browser. You cannot safely put secret keys (database credentials, FCM server key) in the browser — anyone can open DevTools and steal them. The Worker runs on Cloudflare's edge servers worldwide. It holds your secrets and does the trusted work:
- Verifying Firebase tokens (needs Google's public keys)
- Reading/writing your database (needs D1 credentials)
- Sending push notifications (needs FCM server credentials)

Think of the Worker as your secure API server, but instead of running in one data center, it runs in 300+ locations globally and wakes up only when a request comes in.

### D1 — Why?

D1 is Cloudflare's SQLite-based relational database. You use it to store:
- Your **users table** (uid, email, name, photo, created_at)
- **FCM device tokens** (one user can have multiple devices/browsers)
- Any other app data you add later (event bookmarks, ticket purchases, etc.)

It is globally replicated and you query it with normal SQL from your Worker.

### KV — Why?

KV is a key-value store — think of it like a very fast dictionary that lives at the edge, close to every user. You use it for **sessions**.

When a user logs in, your Worker creates a random session UUID, stores `session:{uuid} → { uid, email, exp }` in KV, and sends that UUID back to the browser. On every future request the browser sends the UUID, and the Worker looks it up in KV in under a millisecond. This is faster than hitting D1 on every single request.

D1 = source of truth (full user record). KV = fast session cache.

### R2 — Why?

R2 is object storage (like AWS S3). You use it when users upload files — profile photos, event photos, attachments. You do not store binary files in D1 (a database is not designed for that). R2 is pay-per-use and you get a generous free tier.

### FCM (Firebase Cloud Messaging) — Why?

When a user closes your app, you still want to reach them (event reminder, ticket confirmation, etc.). FCM is Google's push notification system. The flow:
1. Browser registers with FCM → gets a **device token** (a long string that identifies this browser on this device)
2. Your frontend sends that token to your Worker → stored in D1
3. When you need to push a notification, your Worker calls the FCM API with that token → Google delivers it to the user's browser even if the tab is closed

### The Full Request Flow

```
USER CLICKS "Sign in with Google"
    │
    ▼
Firebase Auth SDK (browser)
    │  handles OAuth popup with Google
    │  returns Firebase ID Token (JWT, valid 1 hour)
    │
    ▼
Your React App sends:
    POST /auth/login
    Authorization: Bearer <firebase-id-token>
    │
    ▼
Cloudflare Worker
    │  fetches Google's public keys (JWK endpoint)
    │  verifies JWT signature cryptographically
    │  extracts uid, email, name, photo from token
    │  upserts user row in D1
    │  creates session UUID → writes to KV (7 day expiry)
    │  returns { sessionToken, user } to browser
    │
    ▼
React App stores sessionToken in localStorage
    │
    ▼
All future API calls:
    Authorization: Bearer <session-uuid>
    Worker reads KV[session-uuid] → gets uid → proceeds
```

```
USER IS OFFLINE, YOU WANT TO PUSH A NOTIFICATION
    │
    ▼
Your Worker (triggered by an event/cron/API call)
    │  reads FCM device tokens for that user from D1
    │  signs a JWT with FCM service account key (WebCrypto)
    │  exchanges JWT for OAuth2 access token (Google API)
    │  calls FCM HTTP v1 API with the access token + device token
    │
    ▼
Google delivers push to user's browser
    │
    ▼
firebase-messaging-sw.js (service worker in browser)
    displays the notification
```

---

## 2. Phase 1 — Firebase Project Setup

**⏳ ALL MANUAL** — All steps in this phase are done in the Firebase Console in your browser. No code yet. Complete all 6 steps below, then return here.

---

### Step 1.1 — Create a Firebase Project

1. Open your browser and go to: **https://console.firebase.google.com**
2. You'll see a **"Welcome to Firebase"** page
3. Click the blue **"Add project"** button (top-left area)
4. A popup/dialog appears asking for a **project name**
5. Type: `thestagetime` (or your preferred name — it's just a label for you)
6. Click **"Continue"**
7. Next screen asks about **"Enable Google Analytics for this project"** — toggle it **OFF** (we don't need it)
8. Click **"Create project"**
9. Wait ~30 seconds (you'll see a loading spinner with a message like "Creating your project...")
10. You'll see **"Your new cloud project is ready"** message
11. Click **"Continue"**
12. You land on the **Firebase project dashboard** — you are now inside your Firebase project

✅ **Step 1.1 Complete**

---

### Step 1.2 — Enable Google Sign-In

1. On the **left sidebar**, look for the **"Build"** section (with icons like 🔐, 📊, etc.)
2. Under "Build", click **"Authentication"** (it looks like a lock icon with "Auth" label)
3. A page loads with authentication options — you'll see a message saying **"Get started with Authentication"** (or similar)
4. Click the **"Get started"** button if you see it
5. A new page loads showing different sign-in methods (Google, Facebook, GitHub, Email, Phone, etc.)
6. Look at the **tabs at the top** — make sure you're on the **"Sign-in method"** tab
7. In the list of providers below, find **"Google"** and click on it
8. A **right-side panel** slides out showing Google sign-in settings
9. At the top of that panel, you'll see a **toggle switch** labeled **"Enable"** (it's likely OFF and grey)
10. **Click the toggle to turn it ON** (it should turn blue)
11. Below that, you'll see a field asking for **"Project support email"**
12. **Paste or type your email:** `shivanshu.baweja@veltris.com`
13. At the bottom of the panel, click the **blue "Save" button**
14. You'll see a **green checkmark** appear with the message **"Google provider enabled"**

✅ **Step 1.2 Complete**

---

### Step 1.3 — Register Your Web App and Save the Config

1. Go back to the **Firebase project dashboard** — click the **Firebase logo** or **"Project Overview"** in the left sidebar
2. On the dashboard, you'll see a section with app icons for different platforms: **iOS, Android, Web**
3. Click the **Web icon** (it looks like `</>` or a code bracket symbol)
4. A popup appears asking for an **app nickname**
5. Type: `the-stage-time-web` (or any name you prefer)
6. **IMPORTANT:** Look for a checkbox that says **"Also set up Firebase Hosting"** — make sure it is **UNCHECKED** (do NOT check it)
7. Click **"Register app"**
8. A **code snippet** appears showing your Firebase configuration — **THIS IS WHAT YOU NEED**
9. You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDdFiib8CWYH42T8_iGk7hyoHl5YYz0BDQ",
  authDomain: "thestagetime.firebaseapp.com",
  projectId: "thestagetime",
  storageBucket: "thestagetime.firebasestorage.app",
  messagingSenderId: "26732756309",
  appId: "1:26732756309:web:d5f9ba71d688fdf2a603dc",
};
```

10. **Copy this entire config object** (the curly braces and all values)
11. **Open Notepad (or any text editor) and paste it there** — you will need these values later
12. Click **"Continue to console"** button

✅ **Step 1.3 Complete** — You have your Firebase config saved

---

### Step 1.4 — Add Your Domain to Authorized Domains

Firebase Auth will reject sign-in requests from domains it doesn't recognize. You need to whitelist your domains.

1. In the left sidebar, click **"Build" → "Authentication"** again
2. At the top of the page, you'll see **3 tabs**: "Users", "Sign-in method", "Settings"
3. Click the **"Settings"** tab (the rightmost one)
4. Scroll down until you find **"Authorized domains"** section
5. It probably already shows `localhost` (that's fine — it's added by default for local development)
6. Click the blue **"Add domain"** button
7. A popup appears asking for a domain name
8. **Type:** `localhost:5173` (for local development on your machine)
9. Click **"Add"** button
10. The domain is added to the list
11. Repeat steps 6-9 to add your Cloudflare Pages domain: `stagenew.pages.dev`

✅ **Step 1.4 Complete** — Your domains are authorized

---

### Step 1.5 — Get Your VAPID Key for Web Push Notifications  

VAPID (Voluntary Application Server Identification) is a security standard. Firebase gives you a VAPID key pair. The **public key** goes in your frontend; the **private key** stays secure in Firebase.

**⚠️ IMPORTANT:** The old guide mentions "Cloud Messaging" in the sidebar, but Firebase's UI has changed. Here's the **current correct path:**

location : https://console.firebase.google.com/u/0/project/thestagetime/settings/cloudmessaging
 
1. On the left sidebar, look for the **gear icon ⚙️** at the very top (next to your "TheStageTime" project name)
2. Click it and select **"Project settings"** from the dropdown menu
3. You'll land on the **Settings page** with several tabs at the top
4. Look for and click the **"Cloud Messaging"** tab (scroll the tabs if you don't see it immediately)
5. You'll see a section labeled **"Web configuration"**
6. Below that, you'll see **"Web Push certificates"**
7. **You should see one certificate already listed** — Firebase auto-generates a default one
8. Click the **copy icon** (small clipboard icon) next to the certificate to copy your public VAPID key
9. **OR** if you don't see a certificate, click **"Generate key pair"** button and a new key will be created
10. A long string will appear starting with **`B`** — this is your VAPID key (about 100+ characters)
11. **Copy the entire key** — Open Notepad and paste it with a label:
```
VITE_FCM_VAPID_KEY=BCpaNlqL7eoKj7hmzc146UXhnL38b3rZ1oCjRVnWJcRrqkqtPy1bHocFuE9Nv7D5EQ45_WhWnufhk1XsUoK8zME
```

(Use your actual key, not the example above)

✅ **Step 1.5 Complete** — Your VAPID key is saved

---

### Step 1.6 — Create a Service Account (Download the JSON Key)

The modern FCM API (v1) requires OAuth2 authentication using a **service account**. This is how your Cloudflare Worker proves to Google that it's allowed to send push notifications.

1. Still on the **Project Settings page**, look at the **tabs at the top**
2. Click the **"Service accounts"** tab
3. You'll see a list of service accounts (usually one is already listed for your project)
4. Below the code examples, you'll see a blue button labeled **"Generate new private key"** (or "Generate key")
5. Click it
6. A confirmation popup appears asking **"Are you sure? This will create a new private key"**
7. Click **"Generate key"** (the blue button in the popup)
8. **A JSON file will download automatically** to your Downloads folder
   - It's typically named something like: `thestagetime-xxxxxxxx.json`
   - **SAVE THIS FILE SOMEWHERE SAFE** — Desktop or your project folder is fine
9. **Open the downloaded JSON file with Notepad** (right-click → "Open with" → Notepad)
10. You'll see content like:
```json
{
  "type": "service_account",
  "project_id": "thestagetime",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@thestagetime.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  ...
}
```

11. **Find the `private_key` field** — it's a long string with many lines, starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`
12. **Copy the entire `private_key` value** (including the BEGIN and END lines with all the newlines)
13. **Open Notepad and paste it with a label:**
```
FCM_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvg...
(all the lines)
-----END PRIVATE KEY-----
```

14. Now find the **`client_email` field** in the same JSON file
15. **Copy the email address** — looks like: `firebase-adminsdk-xxxxx@thestagetime.iam.gserviceaccount.com`
16. **Paste it in Notepad with a label:**
```
FCM_CLIENT_EMAIL=firebase-adminsdk-xxxxx@thestagetime.iam.gserviceaccount.com
```

⚠️ **SECURITY WARNING:** This JSON file contains secrets. Never commit it to Git. Never share it. Only your Worker backend will use it.

✅ **Step 1.6 Complete** — Your service account credentials are saved

---

## ✅ Phase 1 — COMPLETE

You should now have in your Notepad:

```
PROJECT_ID=thestagetime

Firebase Config:
{
  apiKey: "AIzaSyDdFiib8CWYH42T8_iGk7hyoHl5YYz0BDQ",
  authDomain: "thestagetime.firebaseapp.com",
  projectId: "thestagetime",
  storageBucket: "thestagetime.firebasestorage.app",
  messagingSenderId: "26732756309",
  appId: "1:26732756309:web:d5f9ba71d688fdf2a603dc",
}

VITE_FCM_VAPID_KEY=BCpaNlqL7eoKj7hmzc146UXhnL38b3rZ1oCjRVnWJcRrqkqtPy1bHocFuE9Nv7D5EQ45_WhWnufhk1XsUoK8zME

FCM_CLIENT_EMAIL=firebase-adminsdk-xxxxx@thestagetime.iam.gserviceaccount.com

FCM_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvg...
-----END PRIVATE KEY-----
```

**→ Next: Come back here and I will start Phase 2 (Cloudflare Infrastructure Setup)**

---

## 3. Phase 2 — Cloudflare Infrastructure Setup

---

### Step 2.1 — Install Wrangler CLI

Wrangler is Cloudflare's command-line tool for managing Workers, D1, KV, and R2.

Open a terminal in your project root and run:

```bash
npm install -g wrangler
```

Verify it installed:
```bash
wrangler --version
```

---

### Step 2.2 — Login to Cloudflare

```bash
wrangler login
```

This opens a browser window. Log in to your Cloudflare account (the same one that hosts your Pages site). When it says "Wrangler is now authenticated," you're done.

**Why this step:** Wrangler needs to know your account to create resources in it and deploy Workers to it.

---

### Step 2.3 — Create the Worker Project

Create a `worker/` subdirectory in your existing repo. This keeps your frontend and backend in one repo but deployed independently.

```bash
mkdir worker
cd worker
npm create cloudflare@latest . -- --type hello-world --lang ts
```

When prompted:
- "Do you want to use git?" → **No** (your parent folder already has git)
- "Do you want to deploy?" → **No** (not yet)

This creates:
```
worker/
├── src/
│   └── index.ts
├── wrangler.toml
├── package.json
└── tsconfig.json
```

---

### Step 2.4 — Create D1 Database

Run this from the `worker/` directory:

```bash
wrangler d1 create stage-time-db
```

You will see output like:
```
✅ Successfully created DB 'stage-time-db' in region WEUR
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "stage-time-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy that `[[d1_databases]]` block** — you will paste it into `wrangler.toml`.

**Why D1:** This is your permanent user database. It lives in Cloudflare's infrastructure, close to your Workers.

---

### Step 2.5 — Create KV Namespace

```bash
wrangler kv namespace create SESSIONS
```

Output:
```
✅ Successfully created KV namespace 'SESSIONS'

Add the following to your configuration file in your kv_namespaces array:
{ binding = "SESSIONS", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

Also create a preview namespace (for local dev):
```bash
wrangler kv namespace create SESSIONS --preview
```

**Copy both IDs** — you will need them for `wrangler.toml`.

**Why KV:** Sessions must be read on every authenticated request. KV reads happen at the nearest edge node in under 1ms — much faster than a D1 query for something this simple.

---

### Step 2.6 — Create R2 Bucket

```bash
wrangler r2 bucket create stage-time-media
```

**Why R2:** When users upload profile photos or event images, you store the binary in R2 and save only the R2 URL in D1. Never store binary files in a SQL database.

---

### Step 2.7 — Update wrangler.toml

Open `worker/wrangler.toml` and replace its contents:

```toml
name = "stage-time-worker"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "stage-time-db"
database_id = "PASTE-YOUR-D1-ID-HERE"

[[kv_namespaces]]
binding = "SESSIONS"
id = "PASTE-YOUR-KV-ID-HERE"
preview_id = "PASTE-YOUR-KV-PREVIEW-ID-HERE"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "stage-time-media"

[vars]
FIREBASE_PROJECT_ID = "the-stage-time"
ALLOWED_ORIGIN = "https://your-project.pages.dev"
```

**Replace:**
- `PASTE-YOUR-D1-ID-HERE` with the D1 database_id from Step 2.4
- `PASTE-YOUR-KV-ID-HERE` with the KV id from Step 2.5
- `PASTE-YOUR-KV-PREVIEW-ID-HERE` with the KV preview id from Step 2.5
- `the-stage-time` with your actual Firebase project ID from Step 1.3
- `your-project.pages.dev` with your actual Cloudflare Pages URL

---

### Step 2.8 — Add Worker Secrets

Secrets are environment variables that are encrypted at rest. Never put secrets in `wrangler.toml` or commit them to Git.

Run these commands from the `worker/` directory (paste when prompted):

```bash
wrangler secret put FCM_CLIENT_EMAIL
```
When prompted, paste the `client_email` from your Firebase service account JSON (Step 1.6).

```bash
wrangler secret put FCM_PRIVATE_KEY
```
When prompted, paste the entire `private_key` value including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines.

**Why secrets and not vars:** `[vars]` in wrangler.toml is visible in your git history and on GitHub. Secrets are stored encrypted in Cloudflare's vault and injected at runtime — your code reads them from `env.FCM_CLIENT_EMAIL` but they are never in your source code.

---

## 4. Phase 3 — D1 Database Schema

---

### Step 3.1 — Create the Schema File

Create `worker/schema.sql`:

```sql
-- Users table: one row per Firebase user
CREATE TABLE IF NOT EXISTS users (
  uid          TEXT PRIMARY KEY,         -- Firebase uid (e.g. "XyZ1234...")
  email        TEXT NOT NULL,
  display_name TEXT,
  photo_url    TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  last_seen_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Device tokens: one user can have many browsers/devices
CREATE TABLE IF NOT EXISTS device_tokens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  uid        TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,        -- FCM device token
  user_agent TEXT,                        -- optional: which browser/device
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_uid ON device_tokens(uid);
```

**Explanation of design choices:**
- `uid` as primary key: Firebase's uid is a stable, unique identifier — no need to generate our own.
- `device_tokens` is separate: one user may sign in on their laptop AND their phone. You need to push to all their devices.
- `UNIQUE` on token: if a browser re-registers and gets the same token, the upsert won't create duplicates.

---

### Step 3.2 — Apply the Schema to D1

From the `worker/` directory:

```bash
wrangler d1 execute stage-time-db --local --file=./schema.sql
```

This runs the SQL against a **local** copy of D1 (for development/testing).

Then apply it to the **remote** (production) D1:

```bash
wrangler d1 execute stage-time-db --remote --file=./schema.sql
```

**Why two steps:** Cloudflare provides a local D1 emulator so you can test without touching production. Always test locally first, then apply to remote.

---

## 5. Phase 4 — Build the Cloudflare Worker

The Worker is your entire backend API. We will build it in multiple focused files.

---

### Step 4.1 — Create the CORS Helper

Create `worker/src/cors.ts`:

```typescript
export const CORS_HEADERS = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
});

export function handleOptions(request: Request, allowedOrigin: string): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS(allowedOrigin),
  });
}

export function jsonResponse(
  data: unknown,
  status: number,
  allowedOrigin: string
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS(allowedOrigin),
    },
  });
}
```

**Why CORS:** Your React app runs on `your-project.pages.dev`. Your Worker runs on `stage-time-worker.your-account.workers.dev`. The browser will block requests between different origins unless the server explicitly allows it via CORS headers.

---

### Step 4.2 — Create the Firebase Token Verifier

Create `worker/src/auth.ts`:

```typescript
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
```

**What this code does, line by line:**
- Splits the JWT (`header.payload.signature`)
- Decodes the header to find which Google key signed it (`kid`)
- Decodes the payload to read the user's uid, email, etc.
- Validates expiry, audience, and issuer (these are the security checks — if any fail, someone may be sending a fake token)
- Fetches Google's JWK (public key) for the matching `kid`
- Uses WebCrypto's `verify()` to mathematically confirm Google signed this token
- If all checks pass, returns the user's info — now you can trust it

---

### Step 4.3 — Create the FCM Push Sender

Create `worker/src/fcm.ts`:

```typescript
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
```

---

### Step 4.4 — Create the Main Worker Router

Replace `worker/src/index.ts` with:

```typescript
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
```

---

### Step 4.5 — Install Worker Dependencies

From the `worker/` directory:

```bash
npm install
```

No extra packages are needed — everything uses the built-in Cloudflare Workers runtime APIs (`crypto.subtle`, `fetch`, D1, KV, R2).

---

## 6. Phase 5 — Frontend: Firebase Auth Integration

Back to the React frontend (`d:/shivanshu sir/stagenew`).

---

### Step 5.1 — Install Firebase SDK

From the **project root** (not `worker/`):

```bash
npm install firebase
```

---

### Step 5.2 — Create Environment Variables

Create `.env` in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=the-stage-time.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=the-stage-time
VITE_FIREBASE_STORAGE_BUCKET=the-stage-time.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FCM_VAPID_KEY=BXXXXXXXXX...your VAPID public key from Step 1.5
VITE_WORKER_URL=https://stage-time-worker.YOUR-ACCOUNT.workers.dev
```

**Fill in the values from:**
- `VITE_FIREBASE_*` — your `firebaseConfig` object from Step 1.3
- `VITE_FCM_VAPID_KEY` — the VAPID public key from Step 1.5
- `VITE_WORKER_URL` — your Worker URL (you will get this after deploying in Phase 7)

Create `.env.local` for local development:
```env
VITE_WORKER_URL=http://localhost:8787
```

**Important:** Add `.env.local` to your `.gitignore`. The `.env` file (without secrets, only public Firebase config) can be committed.

---

### Step 5.3 — Create the Firebase Initializer

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();

// Messaging is only available in browsers that support service workers
export const messaging = typeof window !== 'undefined'
  ? getMessaging(app)
  : null;
```

---

### Step 5.4 — Create the Auth Context

Create `src/context/AuthContext.tsx`:

```typescript
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

interface AppUser {
  uid: string;
  email: string;
  name?: string;
  photo?: string;
}

interface AuthContextType {
  user: AppUser | null;
  sessionToken: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;
const SESSION_KEY = 'stage_time_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY)
  );
  const [loading, setLoading] = useState(true);

  // When app loads, if we have a session token, fetch the user profile
  useEffect(() => {
    if (sessionToken) {
      fetch(`${WORKER_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      })
        .then((r) => (r.ok ? r.json<AppUser>() : null))
        .then((u) => {
          if (u) setUser(u as AppUser);
          else {
            // Session expired or invalid — clear it
            localStorage.removeItem(SESSION_KEY);
            setSessionToken(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async () => {
    // 1. Sign in with Google popup — Firebase handles all the OAuth steps
    const result = await signInWithPopup(auth, provider);

    // 2. Get the Firebase ID token — this is what proves identity to our Worker
    const idToken = await result.user.getIdToken();

    // 3. Send the ID token to our Worker to create a session
    const res = await fetch(`${WORKER_URL}/auth/login`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!res.ok) {
      throw new Error('Login failed — Worker rejected the token');
    }

    const data = await res.json<{ sessionToken: string; user: AppUser }>();

    // 4. Store the session token in localStorage
    localStorage.setItem(SESSION_KEY, data.sessionToken);
    setSessionToken(data.sessionToken);
    setUser(data.user);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem(SESSION_KEY);
    setSessionToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

---

### Step 5.5 — Wrap Your App with AuthProvider

In `src/App.tsx`, add the `AuthProvider`:

```typescript
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>        {/* ← add this */}
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </AuthProvider>       {/* ← add this */}
    </ThemeProvider>
  );
}
```

---

### Step 5.6 — Add a Sign-In Button to Navbar

In `src/components/Navbar.tsx`, use the auth context:

```typescript
import { useAuth } from '../context/AuthContext';

// Inside your Navbar component:
const { user, signIn, signOut, loading } = useAuth();

// Render:
{loading ? null : user ? (
  <div className="flex items-center gap-2">
    {user.photo && <img src={user.photo} alt="" className="w-8 h-8 rounded-full" />}
    <span className="text-sm">{user.name ?? user.email}</span>
    <button onClick={signOut} className="text-sm underline">Sign out</button>
  </div>
) : (
  <button
    onClick={signIn}
    className="px-4 py-2 rounded text-sm font-medium"
    style={{ background: '#C8A85F', color: '#14110D' }}
  >
    Sign in with Google
  </button>
)}
```

---

## 7. Phase 6 — Frontend: FCM Push Notifications

---

### Step 6.1 — Create the Firebase Messaging Service Worker

This is the most important file for push notifications. The browser runs this in the background even when your app tab is closed.

Create `public/firebase-messaging-sw.js`:

```javascript
// This file must be at the root of your domain (/firebase-messaging-sw.js)
// Vite serves files from /public directly at the root

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// This config must match your firebaseConfig — it is public, not secret
firebase.initializeApp({
  apiKey:            self.FIREBASE_API_KEY,
  authDomain:        self.FIREBASE_AUTH_DOMAIN,
  projectId:         self.FIREBASE_PROJECT_ID,
  storageBucket:     self.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
  appId:             self.FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

// Handle background push messages (when tab is closed or in background)
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'The Stage Time', {
    body: body ?? '',
    icon: '/android-icon-192x192.png',
    badge: '/android-icon-192x192.png',
  });
});
```

**Problem:** Service workers cannot read environment variables from Vite. The Firebase config must be hardcoded here, OR injected at build time.

**Solution — use Vite's build to inject values:**

Create `public/firebase-messaging-sw.js` as a template and have Vite write the real values. The simplest approach is to hardcode the public (non-secret) Firebase config directly in this file — it's safe because these are public keys visible to anyone who inspects your HTML anyway.

Replace `self.FIREBASE_API_KEY` etc. with your actual values directly in this file.

---

### Step 6.2 — Create the FCM Registration Hook

Create `src/hooks/useFCM.ts`:

```typescript
import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY as string;
const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;
const FCM_TOKEN_KEY = 'stage_time_fcm_token';

export function useFCM() {
  const { user, sessionToken } = useAuth();

  useEffect(() => {
    // Only run if the user is signed in and messaging is supported
    if (!user || !sessionToken || !messaging) return;

    async function registerForPush() {
      // 1. Ask the user's permission to send notifications
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return;
      }

      // 2. Get the FCM device token for this browser
      // The VAPID key tells FCM this request is from your app (not someone else's)
      const token = await getToken(messaging!, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        ),
      });

      if (!token) return;

      // 3. Don't re-register the same token if we already sent it
      const stored = localStorage.getItem(FCM_TOKEN_KEY);
      if (stored === token) return;

      // 4. Send the token to our Worker to store in D1
      const res = await fetch(`${WORKER_URL}/auth/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          token,
          userAgent: navigator.userAgent,
        }),
      });

      if (res.ok) {
        localStorage.setItem(FCM_TOKEN_KEY, token);
      }
    }

    registerForPush().catch(console.error);
  }, [user, sessionToken]);
}
```

---

### Step 6.3 — Use the FCM Hook in Your App

In `src/App.tsx`, call the hook inside `AppInner`:

```typescript
import { useFCM } from './hooks/useFCM';

function AppInner() {
  useFCM(); // ← runs once user is signed in; registers for push silently

  return (
    <>
      {/* ... rest of your existing JSX ... */}
    </>
  );
}
```

---

## 8. Phase 7 — Deploy and Wire Everything Together

---

### Step 7.1 — Deploy the Worker

From the `worker/` directory:

```bash
wrangler deploy
```

The output will show your Worker URL, something like:
```
✅ Deployed stage-time-worker to:
   https://stage-time-worker.YOUR-ACCOUNT.workers.dev
```

**Copy this URL** — this is your `VITE_WORKER_URL`.

---

### Step 7.2 — Update Your Frontend .env

In the project root `.env`, set:
```env
VITE_WORKER_URL=https://stage-time-worker.YOUR-ACCOUNT.workers.dev
```

---

### Step 7.3 — Set Environment Variables in Cloudflare Pages

Your React app's environment variables from `.env` need to be in Cloudflare Pages too (they are baked into the build at deploy time).

1. Go to **Cloudflare Dashboard → Pages → your project → Settings → Environment variables**
2. Add all your `VITE_*` variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FCM_VAPID_KEY`
   - `VITE_WORKER_URL`
3. Set them for **Production** environment
4. Redeploy your Pages site (push a commit or click "Retry deployment")

---

### Step 7.4 — Add Worker Domain to Firebase Authorized Domains

Your Worker makes calls to Firebase APIs but it's the **browser** that initiates the sign-in, so your Pages domain is what matters here. You already did this in Step 1.4.

However, you should also verify that your Cloudflare Pages custom domain (if any) is in the list.

---

### Step 7.5 — Test the Full Auth Flow Locally

Run local development:

**Terminal 1 — Worker:**
```bash
cd worker
wrangler dev
```
This starts the Worker at `http://localhost:8787`.

**Terminal 2 — Frontend:**
```bash
# In project root
npm run dev
```
This starts Vite at `http://localhost:5173`.

Now open `http://localhost:5173`:
1. Click "Sign in with Google"
2. Complete the Google OAuth popup
3. Open DevTools → Application → Local Storage
4. You should see `stage_time_session` with a long hex token
5. Open DevTools → Network — you should see a POST to `localhost:8787/auth/login` with status 200

---

### Step 7.6 — Test Push Notifications

1. After signing in, check DevTools → Application → Notifications — permission should be "granted"
2. Check DevTools → Network for a POST to `/auth/fcm-token`
3. Check Local Storage for `stage_time_fcm_token`

To test sending a push manually, open DevTools → Console and run:
```javascript
fetch('http://localhost:8787/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('stage_time_session'),
  },
  body: JSON.stringify({
    title: 'Test Notification',
    body: 'Push notifications are working!',
    url: '/',
  }),
});
```

You should see a browser notification appear (or check the notification tray if the tab is active).

---

### Step 7.7 — Deploy Frontend

Push your changes to git. Cloudflare Pages will automatically rebuild and deploy.

```bash
git add .
git commit -m "feat: add Firebase auth + FCM push notifications"
git push
```

---

## Checklist — What You've Built

| Step | Status |
|------|--------|
| Firebase project with Google Auth | ✓ |
| FCM VAPID key | ✓ |
| Service account for FCM HTTP v1 | ✓ |
| Cloudflare Worker deployed | ✓ |
| D1 database with users + device_tokens tables | ✓ |
| KV namespace for sessions | ✓ |
| R2 bucket for media | ✓ |
| Firebase token verification (WebCrypto, no Admin SDK) | ✓ |
| Session creation and validation (KV) | ✓ |
| User upsert in D1 | ✓ |
| FCM device token storage in D1 | ✓ |
| FCM push via HTTP v1 API (OAuth2 from Worker) | ✓ |
| React AuthContext with Google sign-in | ✓ |
| FCM service worker for background push | ✓ |

---

## What's Next (Future Phases)

Once this is working end-to-end, natural next additions are:

1. **Event bookmarks** — POST /bookmarks with session auth, store in D1
2. **R2 file uploads** — POST /upload, Worker writes to R2, returns CDN URL
3. **Scheduled push notifications** — Cloudflare Cron Trigger calls your Worker on a schedule to push event reminders to all users who bookmarked an event
4. **Admin endpoint** — a secret-protected endpoint to send push to all users (marketing broadcasts)

---

*Guide written for The Stage Time project — React + Vite + Cloudflare Pages + Workers + D1 + KV + R2 + Firebase Auth + FCM HTTP v1*
