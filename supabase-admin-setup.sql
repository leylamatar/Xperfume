-- Admin Panel Setup
-- Run this in your Supabase Dashboard > SQL Editor

-- 1. Create admin_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Enable RLS on admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
-- Only authenticated users can view their own admin role
CREATE POLICY "Users can view their own admin role" ON admin_roles
    FOR SELECT USING (auth.uid() = user_id);

-- No one can insert/update/delete admin_roles via frontend (admin only via dashboard)
-- If you want to add admins, do it directly in Supabase Table Editor

-- 4. Example: To make yourself an admin, run this and replace YOUR_USER_ID with your actual user ID from auth.users
-- INSERT INTO admin_roles (user_id) VALUES ('YOUR_USER_ID');
