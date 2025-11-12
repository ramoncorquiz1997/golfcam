-- Usuario/DB (si no existen)
-- CREATE USER clipsazo WITH PASSWORD 'Clipsazo';
-- CREATE DATABASE clipsazo OWNER clipsazo;
-- GRANT ALL PRIVILEGES ON DATABASE clipsazo TO clipsazo;

CREATE TABLE IF NOT EXISTS clubs (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  city        TEXT,
  state       TEXT,
  country     TEXT,
  lat         DOUBLE PRECISION,
  lon         DOUBLE PRECISION,
  image_url   TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clubs_country_idx ON clubs (country);
CREATE INDEX IF NOT EXISTS clubs_state_idx   ON clubs (state);
CREATE INDEX IF NOT EXISTS clubs_city_idx    ON clubs (city);
CREATE INDEX IF NOT EXISTS clubs_name_idx    ON clubs (name);

-- Para búsquedas por texto simple:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS clubs_trgm_idx ON clubs USING GIN ((slug || ' ' || name || ' ' || city || ' ' || state || ' ' || country) gin_trgm_ops);

CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  club_id     INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
  date_utc    TIMESTAMP,
  status      TEXT,
  cta_url     TEXT,
  image_url   TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_date_idx ON events (date_utc);
CREATE INDEX IF NOT EXISTS events_club_idx ON events (club_id);