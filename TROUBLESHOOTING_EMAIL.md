# Troubleshooting Email Delivery Issues

If the function shows "successfully sending email" but you're not receiving emails, follow these steps:

## Step 1: Check Supabase Edge Function Logs

1. Go to Supabase Dashboard → **Edge Functions** → **send-brevo-email**
2. Click on **Logs** tab
3. Look for the detailed logs we added:
   - Check the `Brevo API Response` log
   - Check the `Email configuration` log
   - Look for any error messages

## Step 2: Verify Sender Email in Brevo

**This is the most common issue!**

1. Log in to Brevo: https://app.brevo.com
2. Go to **Settings** → **Senders & IP**
3. Check if `dcodeakhil@gmail.com` is listed and **verified**
4. If not verified:
   - Click **Add a sender**
   - Enter `dcodeakhil@gmail.com`
   - Check your Gmail inbox for verification email
   - Click the verification link
   - Wait a few minutes for verification to complete

## Step 3: Check Your Email Spam/Junk Folder

- Emails from new senders often go to spam
- Check your Gmail **Spam** folder
- Check **Promotions** tab in Gmail
- Mark as "Not Spam" if found

## Step 4: Check Brevo Dashboard

1. Go to Brevo Dashboard → **Statistics** → **Email**
2. Look for recent email sends
3. Check the status:
   - **Delivered** = Email was sent successfully
   - **Bounced** = Email address is invalid
   - **Blocked** = Email was blocked (check sender verification)
   - **Pending** = Email is queued

## Step 5: Verify API Key Permissions

1. Go to Brevo → **Settings** → **SMTP & API** → **API Keys**
2. Check your API key permissions
3. Make sure it has **SMTP** or **Email sending** permissions
4. If not, create a new API key with proper permissions

## Step 6: Test with Brevo API Directly

You can test the Brevo API directly using curl:

```bash
curl -X POST 'https://api.brevo.com/v3/smtp/email' \
  -H 'api-key: YOUR_BREVO_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "sender": {
      "name": "The DCode",
      "email": "dcodeakhil@gmail.com"
    },
    "to": [
      {
        "email": "dcodeakhil@gmail.com",
        "name": "The DCode"
      }
    ],
    "subject": "Test Email",
    "htmlContent": "<p>This is a test email</p>"
  }'
```

## Step 7: Check Brevo Account Limits

1. Go to Brevo Dashboard → **Account** → **Plan & Billing**
2. Check if you've reached your daily/monthly email limit
3. Free plans have limits (e.g., 300 emails/day)

## Step 8: Verify Secrets Are Set Correctly

1. Go to Supabase Dashboard → **Edge Functions** → **Secrets**
2. Verify these secrets are set:
   - `BREVO_API_KEY` - Should be your Brevo API key
   - `BREVO_SENDER_EMAIL` - Should be `dcodeakhil@gmail.com`
   - `CONTACT_FORM_RECIPIENT` - Should be `dcodeakhil@gmail.com`

## Step 9: Check Email Format

Make sure the email addresses are:
- Valid email format
- No extra spaces
- Lowercase (Gmail is case-insensitive but best practice)

## Common Issues & Solutions

### Issue: "Sender email not verified"
**Solution:** Verify the sender email in Brevo dashboard (Step 2)

### Issue: Email in spam folder
**Solution:** Check spam folder, mark as not spam, add sender to contacts

### Issue: API returns success but no email
**Solution:** 
- Check Brevo statistics dashboard
- Verify sender email is verified
- Check account limits

### Issue: "Invalid API key"
**Solution:** 
- Regenerate API key in Brevo
- Update the secret in Supabase
- Make sure API key has email sending permissions

## Still Not Working?

1. Check Supabase Edge Function logs for detailed error messages
2. Check Brevo dashboard → Statistics for email delivery status
3. Try sending a test email directly from Brevo dashboard
4. Contact Brevo support if emails show as "delivered" in Brevo but not received

