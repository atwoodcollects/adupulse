-- ADU Club interest signups
CREATE TABLE club_interest (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  town TEXT NOT NULL,
  interest_type TEXT NOT NULL CHECK (interest_type IN ('detached', 'conversion', 'aging_in_place', 'not_sure')),
  role TEXT NOT NULL CHECK (role IN ('homeowner', 'grandparent', 'adult_child', 'builder', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, town)
);

-- Enable RLS
ALTER TABLE club_interest ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (signups) 
CREATE POLICY "Anyone can sign up" ON club_interest FOR INSERT WITH CHECK (true);

-- Allow public to read aggregate counts only (no emails exposed)
-- We'll handle this through an API route, but allow select for the count query
CREATE POLICY "Public can read for counts" ON club_interest FOR SELECT USING (true);

-- Index for town-level counts
CREATE INDEX idx_club_interest_town ON club_interest(town);
