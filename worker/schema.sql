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
