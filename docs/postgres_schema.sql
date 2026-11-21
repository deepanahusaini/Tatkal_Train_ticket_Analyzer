-- RailPulse AI — Normalized Relational Reference Schema (PostgreSQL 16)
-- Provided for reference / enterprise warehouse synchronization alongside Cloud Firestore.

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  role VARCHAR(24) NOT NULL DEFAULT 'user',
  home_station_code VARCHAR(10) NOT NULL DEFAULT 'NDLS',
  preferred_class VARCHAR(4) NOT NULL DEFAULT '3A',
  preferred_quota VARCHAR(4) NOT NULL DEFAULT 'TQ',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stations (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(80) NOT NULL,
  zone VARCHAR(10) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS trains (
  train_number VARCHAR(10) PRIMARY KEY,
  train_name VARCHAR(120) NOT NULL,
  service_type VARCHAR(16) NOT NULL CHECK (service_type IN ('PASSENGER', 'FREIGHT')),
  category VARCHAR(32) NOT NULL,
  zone VARCHAR(10) NOT NULL,
  source_code VARCHAR(10) NOT NULL REFERENCES stations(code),
  destination_code VARCHAR(10) NOT NULL REFERENCES stations(code),
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  distance_km INTEGER NOT NULL,
  popularity_score SMALLINT NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS train_routes (
  id BIGSERIAL PRIMARY KEY,
  train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number) ON DELETE CASCADE,
  station_code VARCHAR(10) NOT NULL REFERENCES stations(code),
  stop_sequence SMALLINT NOT NULL,
  arrival_time TIME,
  departure_time TIME,
  distance_km INTEGER NOT NULL,
  journey_day SMALLINT NOT NULL DEFAULT 1,
  UNIQUE (train_number, stop_sequence)
);

CREATE TABLE IF NOT EXISTS availability_records (
  id BIGSERIAL PRIMARY KEY,
  train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number) ON DELETE CASCADE,
  travel_date DATE NOT NULL,
  travel_class VARCHAR(4) NOT NULL,
  quota VARCHAR(4) NOT NULL,
  status VARCHAR(24) NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 0,
  rac_number INTEGER NOT NULL DEFAULT 0,
  waitlist_type VARCHAR(10),
  waitlist_number INTEGER NOT NULL DEFAULT 0,
  fare_inr INTEGER,
  provenance VARCHAR(24) NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_avail_lookup ON availability_records (train_number, travel_date, travel_class, quota, captured_at DESC);

CREATE TABLE IF NOT EXISTS historical_snapshots (
  id BIGSERIAL PRIMARY KEY,
  train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number) ON DELETE CASCADE,
  travel_date DATE NOT NULL,
  travel_class VARCHAR(4) NOT NULL,
  quota VARCHAR(4) NOT NULL,
  available_seats INTEGER NOT NULL,
  waitlist_number INTEGER NOT NULL,
  depletion_rate_per_min NUMERIC(6,2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hist_train_time ON historical_snapshots (train_number, recorded_at DESC);

CREATE TABLE IF NOT EXISTS tracked_trains (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number),
  travel_date DATE NOT NULL,
  travel_class VARCHAR(4) NOT NULL,
  quota VARCHAR(4) NOT NULL,
  target_status VARCHAR(24) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  notes VARCHAR(300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  train_number VARCHAR(10) NOT NULL,
  title VARCHAR(140) NOT NULL,
  message VARCHAR(500) NOT NULL,
  category VARCHAR(24) NOT NULL,
  severity VARCHAR(16) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prediction_records (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  train_number VARCHAR(10) NOT NULL REFERENCES trains(train_number),
  travel_date DATE NOT NULL,
  travel_class VARCHAR(4) NOT NULL,
  quota VARCHAR(4) NOT NULL,
  waitlist_type VARCHAR(10) NOT NULL,
  waitlist_number INTEGER NOT NULL,
  probability NUMERIC(5,2) NOT NULL,
  confidence_level VARCHAR(10) NOT NULL,
  model_version VARCHAR(40) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_logs (
  id BIGSERIAL PRIMARY KEY,
  method VARCHAR(8) NOT NULL,
  path VARCHAR(255) NOT NULL,
  status_code SMALLINT NOT NULL,
  latency_ms INTEGER NOT NULL,
  provenance VARCHAR(24) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(10) NOT NULL DEFAULT 'dark',
  email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  browser_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  telegram_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  telegram_handle VARCHAR(64),
  window_reminder_minutes SMALLINT NOT NULL DEFAULT 15,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
