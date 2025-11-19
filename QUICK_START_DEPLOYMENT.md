# 🚀 Quick Start Commands

## Step 1: Install Server Dependencies

```powershell
cd server
npm install serverless-http prisma @prisma/client
```

## Step 2: Set Up Neon Database (After Creating Neon Project)

1. Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

2. Edit `server/.env` and add your Neon connection string:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this"
```

3. Generate Prisma client and push schema:

```powershell
npx prisma generate
npx prisma db push
```

## Step 3: Test Locally (Optional)

```powershell
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd ..
npm install
npm run dev
```

## Step 4: Deploy to Vercel

### Backend Deployment (via CLI - Optional)

```powershell
cd server
npm install -g vercel
vercel
vercel --prod
```

### Frontend Deployment (via CLI - Optional)

```powershell
cd ..
vercel
vercel --prod
```

**Recommended**: Use Vercel Dashboard instead (see DEPLOYMENT_GUIDE.md)

## Step 5: After Deployment

Update frontend environment variable in Vercel:

- `VITE_API_BASE_URL` = `https://your-backend-url.vercel.app/api`

---

## 📝 Important Files Changed

✅ `server/src/app.js` - Express app (serverless-ready)
✅ `server/src/server.js` - Local dev only
✅ `server/api/index.js` - Vercel serverless wrapper
✅ `server/src/config/database.js` - Neon SSL support
✅ `server/prisma/schema.prisma` - Database schema
✅ `server/vercel.json` - Backend Vercel config
✅ `src/lib/api.ts` - Environment-aware API URL
✅ `vercel.json` - Frontend Vercel config

---

## 🔍 Verify Changes Work Locally

Before deploying, test that the refactored code still works:

```powershell
# Install dependencies
cd server
npm install

# Start server (should work as before)
npm run dev
```

The server should start on port 5000 as usual. The serverless changes don't affect local development!

---

See **DEPLOYMENT_GUIDE.md** for the complete step-by-step deployment instructions.
