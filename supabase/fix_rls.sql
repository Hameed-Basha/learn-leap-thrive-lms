-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Check and enable RLS if it's not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- For debugging: make sure appropriate policies exist
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'; 