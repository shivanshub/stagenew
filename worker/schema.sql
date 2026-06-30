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

-- Events table: one row per event
CREATE TABLE IF NOT EXISTS events (
  id               TEXT PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  subtitle         TEXT,
  category         TEXT NOT NULL,
  date             TEXT NOT NULL,
  time             TEXT NOT NULL,
  venue            TEXT NOT NULL,
  city             TEXT NOT NULL,
  price            INTEGER NOT NULL,
  price_label      TEXT NOT NULL,
  image            TEXT NOT NULL,
  hero_image       TEXT,
  duration         TEXT NOT NULL,
  language         TEXT NOT NULL,
  age_rating       TEXT NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT NOT NULL,
  artist           TEXT NOT NULL,
  artist_bio       TEXT NOT NULL,
  tags             TEXT NOT NULL DEFAULT '[]',
  is_featured      INTEGER NOT NULL DEFAULT 0,
  is_promoted      INTEGER NOT NULL DEFAULT 0,
  is_new           INTEGER NOT NULL DEFAULT 0,
  sold_out         INTEGER NOT NULL DEFAULT 0,
  seats_left       INTEGER,
  created_at       INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
