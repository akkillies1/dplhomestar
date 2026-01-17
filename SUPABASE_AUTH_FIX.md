# 🚨 Fix: "Database error querying schema" (500 Error)

This error often happens when an admin user is created via SQL but misses required internal Supabase fields.

## ✅ The Fix: Create User via Dashboard

The safest way to fix this is to let Supabase handle the user creation specific, and then we just add the "Admin" tag.

### Step 1: Delete the "Broken" User
1. Go to **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Find `dcodeakhil@gmail.com`.
3. Click the three dots `...` and select **Delete User**.
   * *(If the user isn't there, just skip to Step 2)*.

### Step 2: Create Fresh User
1. Still in **Authentication** -> **Users**.
2. Click **Add User** (Top Right).
3. Select **"Send Email Invite"** (or "Create new user" if available directly).
   * **Email**: `dcodeakhil@gmail.com`
   * **Password**: `Koovackal@26` (or check "Auto Confirm User" if you can set the password directly, otherwise send invite and click the link).
   * *Tip: If "Add User" only sends an email, do that, then click the link in your email to set the password.*

### Step 3: Make them an Admin
Once the user exists and you know the password works, run this SQL in the **SQL Editor**:

```sql
UPDATE auth.users
SET raw_user_meta_data = '{"is_admin": true}'
WHERE email = 'dcodeakhil@gmail.com';
```

### Step 4: Restart & Test
1. **Restart your local terminal** (Stop `pnpm dev` and run it again).
   * *This ensures your app picks up the new keys properly.*
2. Go to `/admin/login`.
3. Enter PIN (works).
4. Enter Email/Password.

## ❓ Still Failing?
If it still says "Database error querying schema", run this in SQL Editor to see what's wrong:

```sql
SELECT * FROM auth.users WHERE email = 'dcodeakhil@gmail.com';
```
</contents>
</xai:function_call<parameter name="file_path">SUPABASE_AUTH_FIX.md
