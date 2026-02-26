-- =========================
-- CLIPSAZO - Esquema inicial (Golf)
-- =========================

-- --------
-- CLUBS
-- --------
CREATE TABLE IF NOT EXISTS clubs (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  city        TEXT,
  state       TEXT,
  country     TEXT NOT NULL,
  lat         DOUBLE PRECISION,
  lon         DOUBLE PRECISION,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clubs_country_state_city
  ON clubs (country, state, city);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_clubs_updated_at ON clubs;
CREATE TRIGGER trg_clubs_updated_at
BEFORE UPDATE ON clubs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- --------
-- HOLES
-- --------
CREATE TABLE IF NOT EXISTS holes (
  id         SERIAL PRIMARY KEY,
  club_id    INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  slug       TEXT NOT NULL,
  name       TEXT NOT NULL,
  number     SMALLINT,
  par        SMALLINT,
  yardage    INTEGER,
  image_url  TEXT,
  UNIQUE (club_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_holes_club ON holes (club_id);

-- --------
-- EVENTS
-- --------
-- status: 'preregistro' | 'abierto' | 'cerrado' | 'finalizado'
CREATE TABLE IF NOT EXISTS events (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  club_id    INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
  date       DATE NOT NULL,
  cta        TEXT,
  status     TEXT NOT NULL CHECK (status IN ('preregistro','abierto','cerrado','finalizado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events (date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);
CREATE INDEX IF NOT EXISTS idx_events_club_date ON events (club_id, date);

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
