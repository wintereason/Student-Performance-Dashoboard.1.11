# PostgreSQL Setup Guide for Vercel

## Step 1: Create Free PostgreSQL Database

1. Go to **https://neon.tech**
2. Sign up with GitHub (recommended)
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host/database`)

## Step 2: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste your Neon PostgreSQL connection string
4. Click **Save**

## Step 3: Redeploy on Vercel

1. Go to your Vercel project
2. Click **Redeploy** button
3. Wait for build to complete

## Step 4: Migrate Data (First Time Only)

Run this script to import your local data to PostgreSQL:

```bash
python migrate_to_postgres.py
```

## Environment Variables Reference

```
DATABASE_URL=postgresql://user:password@host/database
SECRET_KEY=your-secret-key
FLASK_ENV=production
FLASK_DEBUG=0
CORS_ORIGINS=https://yourdomain.vercel.app
```

## Verify Connection

After deploying, visit: `https://your-app.vercel.app/api/health`

You should see: `{"status":"ok","message":"API is running"}`
