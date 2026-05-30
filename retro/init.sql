CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS retros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retro_id   UUID REFERENCES retros(id) ON DELETE CASCADE,
  column_id  TEXT NOT NULL CHECK (column_id IN ('good','bad','thanks','improve')),
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
