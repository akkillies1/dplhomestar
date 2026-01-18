-- Add country_code and country_iso2 columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '+91';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country_iso2 TEXT DEFAULT 'IN';

-- Update the submit_lead function to accept these new parameters
CREATE OR REPLACE FUNCTION submit_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_location text,
  p_message text,
  p_country_code text DEFAULT '+91',
  p_country_iso2 text DEFAULT 'IN'
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_lead_id uuid;
  result json;
BEGIN
  INSERT INTO leads (name, email, phone, location, message, status, source, country_code, country_iso2)
  VALUES (p_name, p_email, p_phone, p_location, p_message, 'new', 'website_contact_form', p_country_code, p_country_iso2)
  RETURNING id INTO new_lead_id;

  result := json_build_object('id', new_lead_id);
  RETURN result;
END;
$$;
