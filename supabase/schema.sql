-- MA ADU Permit Tracker Database Schema
-- Run this in Supabase SQL Editor

-- Towns table
CREATE TABLE towns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  county TEXT,
  population INTEGER,
  permit_system TEXT, -- 'OpenGov', 'Accela', 'CitizenServe', 'Other'
  permit_portal_url TEXT,
  
  -- Computed stats (updated via trigger or cron)
  total_applications INTEGER DEFAULT 0,
  total_approved INTEGER DEFAULT 0,
  total_denied INTEGER DEFAULT 0,
  avg_days_to_approve DECIMAL(5,1),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permits table
CREATE TABLE permits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  town_id UUID REFERENCES towns(id) ON DELETE CASCADE,
  
  -- Core permit data
  address TEXT,
  permit_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('applied', 'approved', 'denied', 'withdrawn', 'completed')),
  
  -- ADU specifics
  adu_type TEXT CHECK (adu_type IN ('attached', 'detached', 'internal', 'unknown')),
  sqft INTEGER,
  bedrooms INTEGER,
  estimated_value DECIMAL(12,2),
  
  -- Timeline
  applied_date DATE,
  approved_date DATE,
  denied_date DATE,
  completed_date DATE,
  days_to_decision INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN approved_date IS NOT NULL AND applied_date IS NOT NULL 
        THEN approved_date - applied_date
      WHEN denied_date IS NOT NULL AND applied_date IS NOT NULL 
        THEN denied_date - applied_date
      ELSE NULL
    END
  ) STORED,
  
  -- Metadata
  required_variance BOOLEAN DEFAULT FALSE,
  notes TEXT,
  source TEXT NOT NULL CHECK (source IN ('foia', 'manual', 'state_survey', 'scrape')),
  source_date DATE, -- When we obtained this data
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- State survey data (aggregated totals from EOHLC)
CREATE TABLE state_survey_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  town_id UUID REFERENCES towns(id) ON DELETE CASCADE,
  survey_period TEXT NOT NULL, -- e.g., 'H1_2025', 'H2_2025'
  
  applications INTEGER DEFAULT 0,
  approved INTEGER DEFAULT 0,
  denied INTEGER DEFAULT 0,
  certificates_of_occupancy INTEGER DEFAULT 0,
  
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers for alerts
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  
  -- Subscription preferences
  alert_type TEXT NOT NULL CHECK (alert_type IN ('all', 'specific_towns', 'weekly_digest')),
  subscribed_towns UUID[], -- Array of town_ids
  
  -- Status
  verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  unsubscribed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FOIA request tracking
CREATE TABLE foia_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  town_id UUID REFERENCES towns(id) ON DELETE CASCADE,
  
  sent_date DATE NOT NULL,
  due_date DATE, -- 10 business days from sent
  response_date DATE,
  status TEXT NOT NULL CHECK (status IN ('sent', 'acknowledged', 'received', 'denied', 'appealed')),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_permits_town ON permits(town_id);
CREATE INDEX idx_permits_status ON permits(status);
CREATE INDEX idx_permits_approved_date ON permits(approved_date);
CREATE INDEX idx_permits_applied_date ON permits(applied_date);
CREATE INDEX idx_state_survey_town ON state_survey_data(town_id);

-- Function to update town stats
CREATE OR REPLACE FUNCTION update_town_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE towns
  SET 
    total_applications = (SELECT COUNT(*) FROM permits WHERE town_id = COALESCE(NEW.town_id, OLD.town_id)),
    total_approved = (SELECT COUNT(*) FROM permits WHERE town_id = COALESCE(NEW.town_id, OLD.town_id) AND status = 'approved'),
    total_denied = (SELECT COUNT(*) FROM permits WHERE town_id = COALESCE(NEW.town_id, OLD.town_id) AND status = 'denied'),
    avg_days_to_approve = (SELECT AVG(days_to_decision) FROM permits WHERE town_id = COALESCE(NEW.town_id, OLD.town_id) AND days_to_decision IS NOT NULL),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.town_id, OLD.town_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update town stats
CREATE TRIGGER trigger_update_town_stats
AFTER INSERT OR UPDATE OR DELETE ON permits
FOR EACH ROW
EXECUTE FUNCTION update_town_stats();

-- Enable Row Level Security
ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_survey_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE foia_requests ENABLE ROW LEVEL SECURITY;

-- Public read access for towns and permits
CREATE POLICY "Public read access" ON towns FOR SELECT USING (true);
CREATE POLICY "Public read access" ON permits FOR SELECT USING (true);
CREATE POLICY "Public read access" ON state_survey_data FOR SELECT USING (true);

-- Seed initial Metro Boston towns
INSERT INTO towns (name, county, permit_system, permit_portal_url) VALUES
  ('Newton', 'Middlesex', 'OpenGov', 'https://newtonma.portal.opengov.com'),
  ('Brookline', 'Norfolk', 'Accela', 'https://aca-prod.accela.com/BROOKLINE'),
  ('Lexington', 'Middlesex', 'OpenGov', 'https://lexingtonma.portal.opengov.com'),
  ('Arlington', 'Middlesex', 'OpenGov', 'https://arlingtonma.viewpointcloud.com'),
  ('Wellesley', 'Norfolk', 'OpenGov', 'https://wellesleyma.viewpointcloud.com'),
  ('Needham', 'Norfolk', 'OpenGov', 'https://needhamma.viewpointcloud.com'),
  ('Natick', 'Middlesex', 'OpenGov', 'https://natickma.portal.opengov.com'),
  ('Cambridge', 'Middlesex', 'Tyler', 'https://permits.cambridgema.gov'),
  ('Somerville', 'Middlesex', 'CitizenServe', NULL),
  ('Medford', 'Middlesex', 'Other', NULL),
  ('Waltham', 'Middlesex', 'Other', NULL),
  ('Watertown', 'Middlesex', 'Other', NULL),
  ('Belmont', 'Middlesex', 'Other', NULL),
  ('Winchester', 'Middlesex', 'Other', NULL),
  ('Concord', 'Middlesex', 'Other', NULL),
  ('Lincoln', 'Middlesex', 'Other', NULL),
  ('Weston', 'Middlesex', 'Other', NULL),
  ('Wayland', 'Middlesex', 'Other', NULL),
  ('Sudbury', 'Middlesex', 'Other', NULL),
  ('Plymouth', 'Plymouth', 'OpenGov', 'https://plymouthma.viewpointcloud.com')
ON CONFLICT (name) DO NOTHING;
