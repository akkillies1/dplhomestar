# 🔧 Fix Admin Panel & Email Issues

## Issue 1: Cannot Login to Admin Panel

### Problem
The `validate-admin-pin` Edge Function requires JWT verification to be disabled.

### Solution

1. **Go to Supabase Dashboard:**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Disable JWT for Admin PIN Function:**
   - Go to **Edge Functions** (left sidebar)
   - Click on **`validate-admin-pin`** function
   - Click **Settings** tab
   - Find **"Verify JWT"** toggle
   - Turn it **OFF** (gray/disabled)
   - Click **Save/Update**

3. **Set Admin PIN Secret:**
   - In Edge Functions → **Secrets** tab
   - Add secret: `ADMIN_ACCESS_PIN` = your chosen PIN (e.g., `1234`)
   - This PIN will be used for the first login step

4. **Create Admin User:**
   - Go to **Authentication** → **Users**
   - Click **"Add user"**
   - Create user with email/password
   - In **User Metadata**, add: `{"is_admin": true}`
   - Click **Save**

## Issue 2: Email Not Sent (But Data Saved)

### Problem
The `send-brevo-email` Edge Function requires JWT verification to be disabled and/or missing Brevo secrets.

### Solution

1. **Disable JWT for Email Function:**
   - Go to **Edge Functions** → **`send-brevo-email`**
   - Click **Settings** tab
   - Turn **"Verify JWT"** **OFF**
   - Click **Save/Update**

2. **Set Brevo Secrets:**
   - Go to Edge Functions → **Secrets** tab
   - Add these required secrets:

   ```
   BREVO_API_KEY = your_brevo_api_key_here
   BREVO_SENDER_EMAIL = dcodeakhil@gmail.com
   CONTACT_FORM_RECIPIENT = dcodeakhil@gmail.com
   ```

   **Optional:**
   ```
   COMPANY_NAME = The DCode
   ```

3. **Verify Brevo Setup:**
   - Go to Brevo Dashboard: https://app.brevo.com
   - Check **Settings** → **Senders & IP**
   - Ensure `dcodeakhil@gmail.com` is verified as a sender
   - Check **SMTP & API** → **API Keys** for your key

## 🔍 Testing Steps

### Test Admin Login:
1. Visit: `https://your-domain.vercel.app/admin/login`
2. Enter PIN (from `ADMIN_ACCESS_PIN` secret)
3. Enter admin email/password
4. Should redirect to `/admin/dashboard`

### Test Email:
1. Fill out contact form on your website
2. Submit the form
3. Check Supabase → **Table Editor** → **leads** table (data should be there)
4. Check your email at `dcodeakhil@gmail.com`

## 🚨 Common Issues

### "FunctionsHttpError: Edge Function returned a non-2xx status code"
- **Cause:** JWT verification enabled
- **Solution:** Disable JWT verification in Supabase dashboard

### Email goes to spam
- **Cause:** Sender not verified or poor email reputation
- **Solution:** Verify sender email in Brevo, check spam folder

### "Email service not configured"
- **Cause:** Missing `BREVO_API_KEY` secret
- **Solution:** Add the API key secret

## 📋 Complete Checklist

### Admin Panel:
- [ ] JWT disabled for `validate-admin-pin`
- [ ] `ADMIN_ACCESS_PIN` secret set
- [ ] Admin user created with `is_admin: true` metadata
- [ ] Vercel environment variables set

### Email:
- [ ] JWT disabled for `send-brevo-email`
- [ ] `BREVO_API_KEY` secret set
- [ ] `BREVO_SENDER_EMAIL` secret set
- [ ] `CONTACT_FORM_RECIPIENT` secret set
- [ ] Sender email verified in Brevo

## 🆘 Still Having Issues?

### Check Supabase Logs:
1. Go to Edge Functions → Function Name → **Logs** tab
2. Look for error messages
3. Check if secrets are loaded

### Check Vercel Logs:
1. Go to Vercel Dashboard → Deployments → Latest Deployment
2. Click **Functions** tab
3. Check for any errors

### Test Locally:
1. Run `npm run dev`
2. Test admin login and email locally
3. Check browser console for errors

## 📞 Need Help?

If you still can't login or emails aren't sending after following these steps:

1. Share the error messages from Supabase Edge Function logs
2. Share any browser console errors
3. Confirm you've completed all checklist items

The most common issue is JWT verification being enabled when it should be disabled for public functions.
