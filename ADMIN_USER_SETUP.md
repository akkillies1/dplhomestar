# 🔐 Create Admin User for The DCode Website

## Step-by-Step: Create Admin User with `dcodeakhil@gmail.com`

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project (`pbospdlhrabxlstoawaq`)

### 2. Navigate to Authentication
- Click **Authentication** in the left sidebar
- Click **Users** tab

### 3. Add New User
- Click the **"Add user"** button
- Fill in the details:

**User Details:**
```
Email: dcodeakhil@gmail.com
Password: [choose a strong password, e.g., DCode@2024!]
Phone: (optional)
```

**Important:** Check **"Auto-confirm user"** so the user is immediately active.

### 4. Set Admin Metadata
- After creating the user, click on the user row to edit
- Go to **"User Metadata"** section
- Add this JSON metadata:

```json
{
  "is_admin": true
}
```

- Click **"Update user"** to save

### 5. Verify Admin User
- The user should now appear in the users list
- You should see `is_admin: true` in their metadata
- The user can now log in to `/admin/login`

## 🔑 Admin Login Credentials

**Email:** `dcodeakhil@gmail.com`
**Password:** `[the password you set above]`
**PIN:** `[ADMIN_ACCESS_PIN secret value from Edge Functions]`

## 🧪 Test Admin Login

1. Go to: `https://your-domain.vercel.app/admin/login`
2. Enter PIN (from `ADMIN_ACCESS_PIN` secret)
3. Enter email: `dcodeakhil@gmail.com`
4. Enter password
5. Should redirect to `/admin/dashboard`

## 📋 Complete Admin Setup Checklist

- [x] JWT verification disabled for Edge Functions
- [x] `ADMIN_ACCESS_PIN` secret set
- [x] Admin user created with `dcodeakhil@gmail.com`
- [x] User metadata set to `{"is_admin": true}`
- [ ] Test admin login flow
- [ ] Configure email secrets (BREVO_API_KEY, etc.)

## 🚨 Important Notes

- **Password Security:** Choose a strong password for the admin account
- **Auto-confirm:** Make sure to check "Auto-confirm user" when creating
- **Metadata:** The `is_admin: true` metadata is required for admin access
- **PIN Required:** You'll still need the PIN from `ADMIN_ACCESS_PIN` secret for first login step

## 🔄 Alternative: Create User via SQL

If you prefer to create the user via SQL in Supabase:

```sql
-- This will create a user (but you'll still need to set metadata via dashboard)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('dcodeakhil@gmail.com', crypt('YourPasswordHere', gen_salt('bf')), NOW(), NOW(), NOW());
```

But it's easier to use the dashboard method above.

---

**Once the admin user is created, you should be able to log in to the admin panel!** 🎉</contents>
</xai:function_call<parameter name="file_path">ADMIN_USER_SETUP.md
