-- Create leads table to track contact form enquiries
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Lead Management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Metadata
  source TEXT DEFAULT 'website_contact_form',
  
  -- Admin Notes
  notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_date DATE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view and manage leads
CREATE POLICY "Authenticated users can manage leads"
  ON leads
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON leads TO authenticated;
GRANT ALL ON leads TO service_role;
