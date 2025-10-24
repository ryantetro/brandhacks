# 🚀 Deployment Checklist for BrandHacks

## ✅ Current Status

- [x] Vercel Postgres package installed
- [x] API routes updated to use Postgres
- [x] Migration script created
- [x] Setup documentation ready

## 📋 Before You Deploy

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Add Vercel Postgres support for production"
git push origin main
```

### 2. Create Vercel Postgres Database

Go to: https://vercel.com/dashboard

1. Select your **brandhacks** project
2. Click **"Storage"** tab (left sidebar)
3. Click **"Create Database"**
4. Choose **"Postgres"**
5. Name it: `brandhacks-db`
6. Select region closest to you (or same as deployment)
7. Click **"Create"**

### 3. Connect Database to Project

1. After database creation, click **"Connect Project"**
2. Select your **brandhacks** project
3. Click **"Connect"**
4. Environment variables will be automatically added ✅

### 4. Deploy Your App

Your app will auto-deploy when you push to GitHub, OR:

```bash
vercel --prod
```

### 5. Run Database Migration

After first deployment, you need to create the tables:

**Option A: From Vercel Dashboard (Easiest)**
1. Go to Vercel Dashboard > Your Project > Storage > Your Database
2. Click **"Query"** tab
3. Copy and paste the SQL from `src/lib/db-setup.sql`
4. Click **"Run Query"**

**Option B: From Your Computer**
```bash
# Pull production environment variables
vercel env pull .env.local

# Run migration
npm run db:setup
```

## 🎉 You're Done!

Your waitlist is now live and saving to a real database!

## 📊 View Your Data

### Vercel Dashboard Method:
1. Go to Vercel Dashboard
2. Click your project → **Storage** → Your database
3. Click **"Query"** tab
4. Run SQL:
```sql
-- View all waitlist signups
SELECT * FROM waitlist ORDER BY created_at DESC;

-- View all contact messages
SELECT * FROM contacts ORDER BY created_at DESC;

-- Get counts
SELECT COUNT(*) FROM waitlist;
SELECT COUNT(*) FROM contacts;
```

## 🔒 Data Safety

- ✅ **Right Now (Local)**: Your data is safe in `data/waitlist.json`
- ✅ **After Setup**: Data will be safely stored in Vercel Postgres
- ✅ **Migration Script**: Will import existing JSON data to database
- ✅ **Backups**: Vercel automatically backs up your database

## 🆘 Need Help?

If anything goes wrong:
1. Check Vercel deployment logs
2. Make sure environment variables are set
3. Try re-running the migration
4. The JSON files will still work locally for testing

## 💡 Pro Tips

- Keep the `data/` folder until you confirm database is working
- You can run the migration multiple times (it's safe)
- Base count of 237 is maintained (shows 237 + actual signups)
- Export your data regularly from Vercel dashboard

---

**Ready to deploy?** Just follow steps 1-5 above! 🚀

