-- Community Signals: Raw 311 data from SeeClickFix
-- Run this in Supabase SQL Editor
-- NOTE: RLS intentionally disabled — internal-only data, will be exposed through curated APIs later

CREATE TABLE signals_raw (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  town_slug TEXT NOT NULL,
  external_id BIGINT NOT NULL,
  created_at_src TIMESTAMPTZ NOT NULL,
  acknowledged_at_src TIMESTAMPTZ,
  closed_at_src TIMESTAMPTZ,
  category_raw TEXT,
  organization TEXT,
  summary TEXT,
  description TEXT,
  status TEXT,
  lat NUMERIC,
  lng NUMERIC,
  address TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint: one record per town+external_id
ALTER TABLE signals_raw ADD CONSTRAINT signals_raw_town_external_unique UNIQUE (town_slug, external_id);

-- Index for time-range queries per town
CREATE INDEX idx_signals_raw_town_created ON signals_raw (town_slug, created_at_src DESC);

-- Comment documenting RLS decision
COMMENT ON TABLE signals_raw IS 'Raw 311 data from SeeClickFix. RLS intentionally disabled — internal-only, exposed through curated APIs.';
