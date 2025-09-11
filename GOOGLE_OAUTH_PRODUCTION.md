# Google OAuth Production Setup

Your Google OAuth needs to be configured for your production Vercel domain to work properly.

## Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID

## Add Production Redirect URIs

Add these URLs to "Authorized redirect URIs":

### Current Production URL:
```
https://dreamforge-3a1ip2x36-kawacukennedys-projects.vercel.app/api/auth/callback/google
```

### If you have a custom domain, also add:
```
https://yourdomain.com/api/auth/callback/google
```

### For development (already configured):
```
http://localhost:3000/api/auth/callback/google
```

## Add Authorized Origins

Also add these to "Authorized JavaScript origins":

```
https://dreamforge-3a1ip2x36-kawacukennedys-projects.vercel.app
http://localhost:3000
```

## Current OAuth Configuration

✅ Client ID: `128185061124-mspn39pe77spcjlijstj0r29rj8fqr5u.apps.googleusercontent.com`
✅ Client Secret: Set in Vercel environment variables
✅ Local development: Configured
❌ Production domain: **NEEDS TO BE ADDED**

## After Adding URLs

1. Save the changes in Google Cloud Console
2. Wait a few minutes for changes to propagate
3. Test the Google OAuth login on your production site

## Troubleshooting

If you still get OAuth errors:
- Check that the redirect URIs match exactly (no trailing slashes)
- Verify the domain is correctly spelled
- Make sure the OAuth consent screen is configured
- Check Vercel logs for specific error messages
