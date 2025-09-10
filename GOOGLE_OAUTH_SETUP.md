# Google OAuth Setup Guide

To enable Google OAuth login/signup in DreamForge, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `dreamforge-auth`
4. Click "Create"

## 2. Enable Google+ API

1. In your Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API" or "People API"
3. Click on it and press **Enable**

## 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type → **Create**
3. Fill in the required fields:
   - **App name**: `DreamForge`
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On **Scopes** page, click **Save and Continue**
6. On **Test users** page (if External), add your email, then **Save and Continue**

## 4. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set the name: `DreamForge Web Client`
5. Add **Authorized redirect URIs**:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://dreamforge.vercel.app/api/auth/callback/google`
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

## 5. Update Environment Variables

Add to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/auth/signin`
3. You should see a "Continue with Google" button
4. Click it to test the OAuth flow

## Common Issues & Solutions

### Error: "redirect_uri_mismatch"
- Ensure your redirect URI in Google Console exactly matches your app URL
- For local development, use `http://localhost:3000/api/auth/callback/google`

### Error: "This app isn't verified"
- This is normal for development
- Click "Advanced" → "Go to DreamForge (unsafe)" to continue
- For production, you'll need to verify your app with Google

### Error: "access_blocked"
- Make sure you've added your email to test users in OAuth consent screen
- Or publish your app (if ready for production)

## Production Deployment

For production deployment on Vercel:

1. Add your production domain to authorized redirect URIs:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

2. Set environment variables in Vercel dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL=https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET=your-random-secret-key`

## Security Notes

- Never commit your client secret to version control
- Use different OAuth clients for development and production
- Regularly rotate your client secrets
- Keep your OAuth consent screen information up to date

## Additional OAuth Providers

You can also add GitHub OAuth by following similar steps:

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Add authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add `GITHUB_ID` and `GITHUB_SECRET` to your `.env.local`

The authentication system is already configured to handle multiple providers!
