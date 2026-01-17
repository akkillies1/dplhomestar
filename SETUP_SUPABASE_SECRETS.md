# Setting Up Supabase Edge Function Secrets

## Required Secrets for send-brevo-email Function

### 1. Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click on **Secrets** tab
5. Add the following secrets:

#### Required Secrets (must be set):

1. **Name:** `BREVO_API_KEY`
   - **Value:** Your Brevo API key (get it from Brevo dashboard → SMTP & API → API Keys)
   - **Required:** Yes

2. **Name:** `BREVO_SENDER_EMAIL`
   - **Value:** `dcodeakhil@gmail.com` (or your verified Brevo sender email)
   - **Required:** Yes

3. **Name:** `CONTACT_FORM_RECIPIENT`
   - **Value:** `dcodeakhil@gmail.com` (email address where contact form submissions will be sent)
   - **Required:** Yes

#### Optional Secret:

- **Name:** `COMPANY_NAME`
  - **Value:** `The DCode` (defaults to "The DCode" if not set)
  - **Required:** No

### 2. Using Supabase CLI

If you have Supabase CLI installed, run these commands:

```bash
# Set required secrets
supabase secrets set BREVO_API_KEY=your_brevo_api_key_here
supabase secrets set BREVO_SENDER_EMAIL=dcodeakhil@gmail.com
supabase secrets set CONTACT_FORM_RECIPIENT=dcodeakhil@gmail.com

# Set optional secret (optional - defaults to "The DCode" if not set)
supabase secrets set COMPANY_NAME="The DCode"
```

### 3. Getting Your Brevo API Key

1. Log in to Brevo: https://app.brevo.com
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Click **Generate a new API key**
4. Give it a name (e.g., "Supabase Edge Function")
5. Copy the API key (you'll only see it once!)
6. Paste it as the `BREVO_API_KEY` secret in Supabase

### 4. Verify Sender Email in Brevo

Make sure `dcodeakhil@gmail.com` is verified in Brevo:
1. Go to Brevo dashboard → **Settings** → **Senders & IP**
2. Add and verify `dcodeakhil@gmail.com` as a sender email
3. Check your email inbox and click the verification link

### 5. Test the Function

After setting up secrets, test the function by submitting the contact form on your website. Check:
- Supabase Edge Functions logs for any errors
- Your email inbox (`dcodeakhil@gmail.com`) for the contact form submission

## Important Notes

- **REQUIRED Secrets:** `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and `CONTACT_FORM_RECIPIENT` must be set or the function will fail
- `COMPANY_NAME` is optional and defaults to "The DCode" if not set
- Secrets are encrypted and only accessible to your Edge Functions
- After updating secrets, the function will automatically use the new values (no redeploy needed)
- Make sure `BREVO_SENDER_EMAIL` matches a verified sender email in your Brevo account

