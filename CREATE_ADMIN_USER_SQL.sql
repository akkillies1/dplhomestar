-- ============================================
-- Create Admin User for The DCode Website
-- ============================================
-- Run this in Supabase SQL Editor
-- WARNING: This creates a user with a plaintext password
-- ============================================

-- Method 1: Create user via SQL (NOT recommended for production)

DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Insert user into auth.users (corrected column names)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000'::uuid, -- default instance_id
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'dcodeakhil@gmail.com',
        crypt('Koovackal@26', gen_salt('bf')), -- Your password
        NOW(), -- email_confirmed_at
        NOW(), -- created_at
        NOW(), -- updated_at
        '',
        '',
        '',
        '{"is_admin": true}'::jsonb -- Admin metadata
    )
    RETURNING id INTO new_user_id;

    RAISE NOTICE 'Created admin user with ID: %', new_user_id;
END $$;

-- ============================================
-- Alternative: Just update metadata for existing user
-- ============================================

-- If user already exists, just update the metadata:
-- UPDATE auth.users
-- SET raw_user_meta_data = '{"is_admin": true}'::jsonb,
--     updated_at = NOW()
-- WHERE email = 'dcodeakhil@gmail.com';

-- ============================================
-- Verify the user was created
-- ============================================

-- Check if user exists:
SELECT id, email, user_metadata, created_at
FROM auth.users
WHERE email = 'dcodeakhil@gmail.com';

-- ============================================
-- NOTES:
-- 1. Change 'DCode@2024!' to your desired password
-- 2. The password will be encrypted using bcrypt
-- 3. User will be auto-confirmed (email_confirmed_at = NOW())
-- 4. User metadata includes {"is_admin": true}
-- 5. RECOMMENDED: Use Supabase Dashboard instead for security
-- ============================================</contents>
</xai:function_call<parameter name="file_path">CREATE_ADMIN_USER_SQL.sql
