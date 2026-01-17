# Vercel Deployment Guide

## Environment Variables Required

Set these environment variables in your Vercel dashboard:

### Supabase Configuration (Required)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key

### Admin Access (Required for admin panel)
- `ADMIN_ACCESS_PIN` - PIN code for admin login (set in Supabase Edge Function secrets)

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `akkillies1/alldcode.com`
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2. Set Environment Variables

In your Vercel project settings:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following variables:

#### Required Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

#### Optional Variables (for email functionality):
```
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=dcodeakhil@gmail.com
CONTACT_FORM_RECIPIENT=dcodeakhil@gmail.com
COMPANY_NAME=The DCode
```

### 3. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your site will be available at `https://your-project-name.vercel.app`

### 4. Configure Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Admin Panel Access

After deployment, the admin panel will be accessible at:
`https://your-domain.com/admin/login`

### First-Time Setup:

1. **Create Admin User in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user"
   - Create a user with email/password
   - In user metadata, add: `{"is_admin": true}`

2. **Set Admin PIN:**
   - Go to Supabase Dashboard → Edge Functions → Secrets
   - Add secret: `ADMIN_ACCESS_PIN` = your chosen PIN number

## Troubleshooting

### Admin Panel Not Accessible

1. **Check Environment Variables:**
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set correctly
   - Check Vercel deployment logs for any missing environment variables

2. **Check Supabase Connection:**
   - Verify your Supabase project is active
   - Check that RLS policies allow access to tables

3. **Check Admin User Setup:**
   - Ensure an admin user exists in Supabase Auth
   - Verify the user has `is_admin: true` in metadata

4. **Check Edge Function Secrets:**
   - `ADMIN_ACCESS_PIN` must be set in Supabase Edge Function secrets
   - JWT verification should be disabled for `validate-admin-pin` function

### Build Issues

1. **Check Vercel Build Logs:**
   - Go to your Vercel deployment → **Functions** tab
   - Check for any build errors

2. **Common Issues:**
   - Missing dependencies: Check `package.json`
   - Build command: Should be `npm run build`
   - Node version: Vercel should auto-detect from `package.json`

## Email Functionality

To enable email notifications:

1. **Set up Brevo API:**
   - Get API key from Brevo dashboard
   - Set `BREVO_API_KEY` in Vercel environment variables

2. **Configure Supabase Edge Functions:**
   - Deploy the Edge Functions from your `supabase/functions` folder
   - Set secrets in Supabase Dashboard → Edge Functions → Secrets

3. **Disable JWT Verification:**
   - For `send-brevo-email` function: Disable JWT verification in Supabase dashboard

## Performance Optimization

### Vercel Analytics (Optional)
- Enable Vercel Analytics for performance monitoring

### Image Optimization
- All images in `public/` folder are automatically optimized by Vercel
- Consider using Vercel's Image Optimization API for dynamic images

## Security Notes

- Never commit sensitive environment variables to Git
- Use Supabase RLS policies to secure your data
- Regularly rotate API keys and secrets
- Monitor your Supabase usage and costs
