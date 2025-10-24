# Vercel Postgres Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (brandhacks)
3. Click on the **"Storage"** tab
4. Click **"Create Database"**
5. Choose **"Postgres"**
6. Give it a name like `brandhacks-db`
7. Select a region close to you
8. Click **"Create"**

### Step 2: Connect Database to Your Project

1. After creating the database, Vercel will show you environment variables
2. Click **"Connect Project"** or **"Copy Snippet"**
3. The variables will automatically be added to your project

Your `.env.local` will need these variables (Vercel adds them automatically):
```bash
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### Step 3: Run Migration Locally (Optional - Test Before Deploy)

If you want to test locally first:

1. Copy the environment variables to your `.env.local` file
2. Run the migration:
```bash
npx tsx scripts/migrate-to-postgres.ts
```

### Step 4: Deploy to Vercel

```bash
git add .
git commit -m "Add Vercel Postgres support"
git push
```

Vercel will automatically deploy and run your database-connected app!

### Step 5: Run Migration in Production

After your first deployment, run the migration in production:

1. Go to your Vercel project dashboard
2. Click on **"Settings"** → **"Functions"**
3. Or run this command locally (it will use production database):
```bash
vercel env pull .env.local
npx tsx scripts/migrate-to-postgres.ts
```

## ✅ That's It!

Your waitlist and contact forms now save to Vercel Postgres instead of JSON files!

## 📊 View Your Data

### Option 1: Vercel Dashboard
1. Go to your project on Vercel
2. Click **"Storage"** tab
3. Click on your database
4. Use the **"Query"** tab to run SQL:
```sql
SELECT * FROM waitlist ORDER BY created_at DESC;
SELECT * FROM contacts ORDER BY created_at DESC;
```

### Option 2: Create an Admin Page
We can build a simple admin dashboard to view signups (let me know if you want this!)

## 🔄 Migration Notes

- The migration script automatically imports existing data from `data/waitlist.json` and `data/contacts.json`
- After confirming everything works, you can delete the `data/` folder
- The base count of 237 is still maintained (adds to database count)

## 🆘 Troubleshooting

**"Cannot connect to database"**
- Make sure you've copied the env variables from Vercel
- Check that your database is in the same region as your deployment

**"Table already exists"**
- That's okay! The migration is idempotent (safe to run multiple times)

**Need help?**
Just ask! 🙂

