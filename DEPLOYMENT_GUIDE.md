# 🚀 Complete Deployment Guide: Vercel + Neon + Prisma

This guide will walk you through deploying your Finance Tracker application with:

- **Frontend & Backend**: Vercel (serverless)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma

---

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ **Accounts created**:

   - [Vercel Account](https://vercel.com/signup) (free tier available)
   - [Neon Account](https://neon.tech/signup) (free tier available)
   - [GitHub Account](https://github.com) (to connect your repository)

2. ✅ **Repository on GitHub**:

   - Push your project to a GitHub repository
   - Make sure it's accessible to Vercel

3. ✅ **Local tools installed**:
   - Node.js 18+ (`node --version`)
   - npm or yarn
   - Git

---

## 🗄️ STEP 1: Set Up Neon PostgreSQL Database

### 1.1 Create a Neon Project

1. Go to [Neon Console](https://console.neon.tech)
2. Click **"New Project"**
3. Configure:
   - **Project Name**: `finance-tracker`
   - **PostgreSQL Version**: Latest (16 recommended)
   - **Region**: Choose closest to your users
4. Click **"Create Project"**

### 1.2 Get Your Database Connection String

1. In your Neon project dashboard, click **"Connection Details"**
2. Copy the **Connection String** (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Save this connection string** - you'll need it multiple times

### 1.3 Create the Database Schema

You have two options:

**Option A: Using Prisma (Recommended)**

1. Navigate to the server directory:

   ```powershell
   cd server
   ```

2. Install dependencies (if you haven't already):

   ```powershell
   npm install serverless-http prisma @prisma/client
   ```

3. Create a `.env` file in the `server` directory:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Edit `server/.env` and add your Neon connection string:

   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   JWT_EXPIRES_IN="7d"
   NODE_ENV="development"
   ```

5. Generate Prisma Client:

   ```powershell
   npx prisma generate
   ```

6. Push the schema to Neon:
   ```powershell
   npx prisma db push
   ```

**Option B: Using the Existing Init Script**

1. Update `server/.env` with Neon credentials:

   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

2. Run the initialization script:
   ```powershell
   cd server
   npm run init-db
   ```

### 1.4 Verify Database Setup

1. In Neon Console, go to **"Tables"**
2. You should see three tables:
   - `users`
   - `accounts`
   - `transactions`

---

## 🖥️ STEP 2: Deploy Backend to Vercel

### 2.1 Prepare Backend for Deployment

Your backend has been restructured for serverless:

- ✅ `server/src/app.js` - Express app (no listening)
- ✅ `server/src/server.js` - Local development only
- ✅ `server/api/index.js` - Vercel serverless function
- ✅ `server/vercel.json` - Vercel configuration
- ✅ `server/prisma/schema.prisma` - Database schema

### 2.2 Deploy Backend to Vercel

#### Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)

2. Click **"Add New..."** → **"Project"**

3. Import your GitHub repository

4. Configure the project:

   - **Project Name**: `finance-tracker-api` (or your preferred name)
   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (serverless functions don't need build)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add **Environment Variables** (Critical!):

   Click **"Environment Variables"** and add:

   | Name             | Value                          | Environment         |
   | ---------------- | ------------------------------ | ------------------- |
   | `DATABASE_URL`   | Your Neon connection string    | Production, Preview |
   | `JWT_SECRET`     | A strong secret (min 32 chars) | Production, Preview |
   | `JWT_EXPIRES_IN` | `7d`                           | Production, Preview |
   | `NODE_ENV`       | `production`                   | Production          |

   **Example JWT_SECRET generation**:

   ```powershell
   # Generate a secure random string
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

6. Click **"Deploy"**

7. Wait for deployment (usually 1-2 minutes)

8. **Save your API URL**:
   - After deployment, copy the URL (e.g., `https://finance-tracker-api.vercel.app`)
   - You'll need this for the frontend

### 2.3 Test Your Backend API

Open these URLs in your browser:

1. Health check:

   ```
   https://your-api-url.vercel.app/health
   ```

   Should return:

   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2025-11-18T..."
   }
   ```

2. Test signup (using a tool like Postman or curl):
   ```powershell
   curl -X POST https://your-api-url.vercel.app/api/auth/signup `
     -H "Content-Type: application/json" `
     -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
   ```

---

## 🌐 STEP 3: Deploy Frontend to Vercel

### 3.1 Configure Frontend Environment

1. The frontend is already configured to use `VITE_API_BASE_URL` environment variable

2. Your `src/lib/api.ts` now reads:
   ```typescript
   const API_BASE_URL =
     import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
   ```

### 3.2 Deploy Frontend to Vercel

#### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)

2. Click **"Add New..."** → **"Project"**

3. Select the **same GitHub repository**

4. Configure the project:

   - **Project Name**: `finance-tracker` (or your preferred name)
   - **Root Directory**: `.` (leave as repository root)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add **Environment Variables**:

   | Name                | Value                                 | Environment         |
   | ------------------- | ------------------------------------- | ------------------- |
   | `VITE_API_BASE_URL` | `https://your-api-url.vercel.app/api` | Production, Preview |

   ⚠️ **Important**: Use your actual backend API URL from Step 2.2

6. Click **"Deploy"**

7. Wait for deployment (usually 2-3 minutes)

8. Open your deployed frontend URL

### 3.3 Test Your Application

1. Open your frontend URL (e.g., `https://finance-tracker.vercel.app`)

2. Test the flow:

   - ✅ Click **Sign Up** → Create an account
   - ✅ Log in with your credentials
   - ✅ Create an account (bank/cash account)
   - ✅ Add a transaction (income/expense)
   - ✅ View dashboard with charts

3. Verify in Neon:
   - Go to Neon Console → **SQL Editor**
   - Run: `SELECT * FROM users;`
   - You should see your test user

---

## 🔧 STEP 4: Post-Deployment Configuration

### 4.1 Set Up Custom Domains (Optional)

#### For Backend:

1. In Vercel, go to your API project → **Settings** → **Domains**
2. Add domain: `api.yourdomain.com`
3. Follow DNS configuration instructions
4. Update frontend `VITE_API_BASE_URL` to use custom domain

#### For Frontend:

1. In Vercel, go to your frontend project → **Settings** → **Domains**
2. Add domain: `yourdomain.com`
3. Follow DNS configuration instructions

### 4.2 Enable Automatic Deployments

Both projects are now set up for automatic deployment:

- **Push to `main` branch** → Deploys to Production
- **Push to other branches** → Creates Preview deployments

### 4.3 Monitor Your Application

1. **Vercel Logs**:

   - Go to project → **Deployments** → Click on a deployment
   - View **Functions** tab for serverless logs

2. **Neon Monitoring**:
   - Go to Neon Console → **Monitoring**
   - View connection count, query performance

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors in frontend

**Solution**:

1. Check browser console for exact error
2. Verify `VITE_API_BASE_URL` is set correctly in Vercel
3. Ensure API URL includes `/api` at the end
4. Check CORS is enabled in backend (already configured)

### Issue: "Connection refused" to database

**Solution**:

1. Verify `DATABASE_URL` in Vercel backend environment variables
2. Ensure `?sslmode=require` is in the connection string
3. Check Neon project is not suspended (free tier auto-sleeps after inactivity)
4. Wake up Neon: Run any query in SQL Editor

### Issue: JWT authentication errors

**Solution**:

1. Verify `JWT_SECRET` is set in Vercel backend
2. Ensure it's the same across all environments
3. Check token is being stored in localStorage (Frontend → DevTools → Application)

### Issue: Prisma errors in serverless

**Solution**:

1. Ensure `prisma generate` runs during build
2. Add to `server/package.json` scripts:
   ```json
   "postinstall": "prisma generate"
   ```
3. Redeploy backend

### Issue: Too many database connections

**Solution**:

1. Neon free tier: max 100 connections
2. Enable Neon connection pooling:
   - In Neon Console → **Connection Details**
   - Copy "Pooled Connection" string instead
   - Update `DATABASE_URL` in Vercel

### Issue: Environment variables not updating

**Solution**:

1. After changing env vars in Vercel, you MUST redeploy:
   - Go to **Deployments** → Click **"..."** → **"Redeploy"**
2. Or push a new commit to trigger redeployment

---

## 📊 Best Practices

### Security

1. ✅ **Never commit `.env` files**
   - Already in `.gitignore`
2. ✅ **Use strong JWT secrets**

   - Minimum 32 characters
   - Random alphanumeric

3. ✅ **Rotate secrets regularly**
   - Update in Vercel environment variables
   - Redeploy after rotation

### Performance

1. ✅ **Use Neon connection pooling** for serverless

   - Prevents "too many connections" errors

2. ✅ **Consider Prisma Accelerate** for production

   - Adds connection pooling and caching
   - [Learn more](https://www.prisma.io/data-platform/accelerate)

3. ✅ **Enable Vercel Edge Caching**
   - Add cache headers to static endpoints

### Cost Optimization

1. **Neon Free Tier**:

   - 1 project
   - 10 GB storage
   - Auto-sleep after inactivity

2. **Vercel Free Tier**:
   - 100 GB bandwidth/month
   - Unlimited serverless function invocations
   - 6,000 build minutes/month

---

## 🎉 You're Done!

Your Finance Tracker is now live with:

- ✅ Frontend hosted on Vercel
- ✅ Backend running as serverless functions on Vercel
- ✅ PostgreSQL database on Neon
- ✅ Prisma ORM for type-safe database access
- ✅ Automatic deployments on git push
- ✅ SSL/HTTPS enabled by default

### Next Steps

1. Share your app URL with users
2. Set up custom domains
3. Monitor usage in Vercel and Neon dashboards
4. Consider upgrading to paid tiers as you scale

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com)

---

## 🆘 Need Help?

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Neon Discord**: [discord.gg/neon](https://discord.gg/92vNTGSqpb)
- **Prisma Discord**: [discord.gg/prisma](https://discord.gg/prisma)

---

**Made with ❤️ for Finance Tracker**
