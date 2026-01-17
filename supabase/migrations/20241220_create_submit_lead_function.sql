-- Create a secure function to submit leads bypassing RLS
CREATE OR REPLACE FUNCTION submit_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_location text,
  p_message text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- <--- Bypass RLS to allow insertion
SET search_path = public
AS $$
DECLARE
  new_lead_id uuid;
  result json;
BEGIN
  INSERT INTO leads (name, email, phone, location, message, status, source)
  VALUES (p_name, p_email, p_phone, p_location, p_message, 'new', 'website_contact_form')
  RETURNING id INTO new_lead_id;

  result := json_build_object('id', new_lead_id);
  RETURN result;
END;
$$;

-- Grant execute permission to public (anonymous) users
GRANT EXECUTE ON FUNCTION submit_lead TO anon;
