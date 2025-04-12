-- Create a function to handle profile creation that bypasses RLS
CREATE OR REPLACE FUNCTION create_new_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_role TEXT DEFAULT 'student'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator (superuser)
AS $$
DECLARE
  profile_record JSONB;
BEGIN
  -- Check if profile already exists to avoid duplicates
  SELECT row_to_json(p)::JSONB INTO profile_record
  FROM profiles p
  WHERE p.id = user_id;
  
  -- If profile doesn't exist, create it
  IF profile_record IS NULL THEN
    INSERT INTO profiles (id, email, name, role, created_at, updated_at)
    VALUES (
      user_id,
      user_email,
      user_name,
      user_role,
      NOW(),
      NOW()
    )
    RETURNING row_to_json(profiles)::JSONB INTO profile_record;
  END IF;
  
  RETURN profile_record;
END;
$$; 