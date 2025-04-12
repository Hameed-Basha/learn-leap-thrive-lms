-- Create a secure function to promote a user to a different role
-- This function can only be executed by users with the 'admin' role
CREATE OR REPLACE FUNCTION promote_user(
  target_user_id UUID,
  new_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
AS $$
DECLARE
  calling_user_role TEXT;
  target_user_exists BOOLEAN;
  result JSONB;
BEGIN
  -- Check if the calling user is an admin
  SELECT role INTO calling_user_role
  FROM profiles
  WHERE id = auth.uid();
  
  IF calling_user_role IS NULL OR calling_user_role != 'admin' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Only administrators can promote users'
    );
  END IF;
  
  -- Validate the new role
  IF new_role NOT IN ('student', 'instructor', 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid role. Must be "student", "instructor", or "admin"'
    );
  END IF;
  
  -- Check if the target user exists
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = target_user_id
  ) INTO target_user_exists;
  
  IF NOT target_user_exists THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Target user does not exist'
    );
  END IF;
  
  -- Update the user's role
  UPDATE profiles
  SET 
    role = new_role,
    updated_at = NOW()
  WHERE id = target_user_id
  RETURNING row_to_json(profiles)::JSONB INTO result;
  
  RETURN jsonb_build_object(
    'success', true,
    'data', result
  );
END;
$$; 