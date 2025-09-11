# Production Database Setup for DreamForge

Your Vercel deployment is getting 500 errors because the DATABASE_URL environment variable is set to a placeholder. You need a real PostgreSQL database for production.

## Quick Setup with Neon (Recommended)

### Step 1: Create Neon Database
1. Go to [neon.tech](https://neon.tech/)
2. Sign up with your GitHub account (same as Vercel)
3. Create a new project called "dreamforge"
4. Select PostgreSQL 15+
5. Choose the free tier (perfect for development)

### Step 2: Get Database URL
1. After creating the project, go to Dashboard
2. Click "Connection Details"
3. Copy the "Connection string" (it looks like):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dreamforge?sslmode=require
   ```

### Step 3: Update Vercel Environment Variable
Run this command with your actual Neon database URL:

```bash
# Replace with your actual Neon database URL
npx vercel env rm DATABASE_URL production
echo "your-neon-database-url-here" | npx vercel env add DATABASE_URL production
```

### Step 4: Push Database Schema
```bash
# Generate Prisma client for production
npx prisma db push --accept-data-loss
```

### Step 5: Redeploy
```bash
npx vercel --prod
```

## Alternative: Vercel Postgres

If you prefer Vercel's own database:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your dreamforge project
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. The DATABASE_URL will be automatically added to your project

## Alternative: Supabase

1. Go to [supabase.com](https://supabase.com/)
2. Create new project
3. Get database URL from Settings → Database
4. Update Vercel env var as shown above

## Troubleshooting

If you still get 500 errors after setting up the database:

1. Check logs: `npx vercel logs your-deployment-url`
2. Verify all environment variables are set: `npx vercel env ls`
3. Make sure Google OAuth redirect URLs include your Vercel domain

## Current Status

✅ Environment variables set:
- NEXTAUTH_SECRET
- NEXTAUTH_URL  
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GEMINI_API_KEY

❌ Needs real database:
- DATABASE_URL (currently placeholder)
