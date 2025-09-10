# DreamForge Deployment Guide

This guide will help you deploy DreamForge to Vercel with all the necessary environment variables and secrets.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: Vercel Postgres or Neon)
3. **Google OAuth**: Set up Google Cloud Console project (see `GOOGLE_OAUTH_SETUP.md`)
4. **Gemini API**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Add Vercel Postgres to your project
vercel postgres create dreamforge-db
```

### Option B: Neon Database
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

## Step 2: Set Up Vercel Secrets

Run these commands in your project directory:

```bash
# Database
vercel env add database_url
# Paste your PostgreSQL connection string

# NextAuth configuration
vercel env add nextauth_url
# Enter: https://your-app-name.vercel.app

vercel env add nextauth_secret
# Generate a secure secret: openssl rand -base64 32

# Google OAuth (from Google Cloud Console)
vercel env add google_client_id
# Paste your Google Client ID

vercel env add google_client_secret  
# Paste your Google Client Secret

# Gemini AI API
vercel env add gemini_api_key
# Paste your Gemini API key from Google AI Studio
```

## Step 3: Deploy

```bash
# Deploy to Vercel
vercel --prod
```

## Step 4: Update Google OAuth Settings

After deployment, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Credentials > OAuth 2.0 Client IDs
3. Add your production URL to authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Your app's production URL |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth.js |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |

## Troubleshooting

### Database Issues
- Make sure your DATABASE_URL points to PostgreSQL, not SQLite
- Run `npx prisma generate && npx prisma db push` after database setup

### OAuth Issues
- Verify redirect URIs in Google Cloud Console
- Check that client ID and secret are correctly set
- Ensure NEXTAUTH_URL matches your actual domain

### Build Issues
- Check that all required environment variables are set
- Review build logs in Vercel dashboard

## Local Development vs Production

- **Local**: Uses SQLite (`file:./dev.db`)
- **Production**: Uses PostgreSQL (from Vercel Postgres or Neon)

Make sure to run database migrations when switching between environments.
