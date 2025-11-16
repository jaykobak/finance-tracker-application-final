# 🚀 Quick Start Commands - Finance Tracker Backend

## 📋 Prerequisites Check

```bash
# Check if Node.js is installed
node -v

# Check if PostgreSQL is installed
psql --version
```

---

## ⚡ Quick Setup (5 Steps)

### 1️⃣ Install Dependencies

```bash
cd server
npm install
```

### 2️⃣ Configure Database Password

Edit `server/.env` file:

```env
DB_PASSWORD=your_postgres_password_here
```

### 3️⃣ Create Database

**Option A - pgAdmin:**

- Open pgAdmin → Right-click Databases → Create Database
- Name: `finance_tracker`

**Option B - Command Line:**

```bash
psql -U postgres
CREATE DATABASE finance_tracker;
\q
```

### 4️⃣ Initialize Tables

```bash
npm run init-db
```

### 5️⃣ Start Server

```bash
npm run dev
```

✅ **Success!** You should see: `🚀 Server running on port 5000`

---

## 🎯 Daily Usage

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend (New Terminal)

```bash
npm run dev
```

---

## 🧪 Test Your API

### Recommended Tool: Thunder Client

Install in VS Code:

```vscode-extensions
rangav.vscode-thunder-client
```

### Quick Test:

1. Open Thunder Client in VS Code
2. New Request → POST
3. URL: `http://localhost:5000/api/auth/signup`
4. Body (JSON):

```json
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "test123"
}
```

5. Click Send → You should get a token!

---

## 📡 API Endpoints Quick Reference

### Authentication

```
POST   /api/auth/signup    - Create account
POST   /api/auth/login     - Login
GET    /api/auth/me        - Get profile (requires token)
```

### Transactions (Requires Token)

```
GET    /api/transactions           - Get all
GET    /api/transactions/:id       - Get one
POST   /api/transactions           - Create
PUT    /api/transactions/:id       - Update
DELETE /api/transactions/:id       - Delete
GET    /api/transactions/summary   - Get summary
```

---

## 🔑 Using Authentication Token

After login/signup, you get a token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use it in requests:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📁 File Structure at a Glance

```
project/
├── server/                    # ← Backend (NEW!)
│   ├── src/
│   │   ├── server.js         # Main server
│   │   ├── config/           # Database setup
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   └── middleware/       # Auth & errors
│   ├── .env                  # Config (passwords)
│   └── package.json          # Dependencies
│
├── src/                       # ← Frontend (UPDATED!)
│   └── lib/
│       ├── api.ts            # API calls (NEW!)
│       ├── auth.tsx          # Real auth (UPDATED!)
│       └── store.ts          # Real data (UPDATED!)
│
└── BACKEND_SETUP.md          # Full guide
```

---

## 🐛 Quick Troubleshooting

### Problem: Can't connect to database

```bash
# Check PostgreSQL is running
# Windows: Services → postgresql → Start
```

### Problem: Port 5000 in use

```bash
# Change port in server/.env
PORT=5001

# Update frontend: src/lib/api.ts
# Change: const API_BASE_URL = 'http://localhost:5001/api'
```

### Problem: "Module not found"

```bash
cd server
npm install
```

### Problem: Token expired

- Just login again in your app
- Or increase JWT_EXPIRES_IN in server/.env

---

## 📚 Where to Learn More

- **Full Setup Guide**: `BACKEND_SETUP.md`
- **Technical Details**: `BACKEND_SUMMARY.md`
- **Backend README**: `server/README.md`

---

## ✅ Checklist

- [ ] PostgreSQL installed
- [ ] Node.js installed
- [ ] Thunder Client installed (optional)
- [ ] Dependencies installed (`npm install`)
- [ ] Database created (`finance_tracker`)
- [ ] Password set in `.env`
- [ ] Tables initialized (`npm run init-db`)
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Test signup/login working

---

## 🎉 You're All Set!

Your finance tracker now has:
✅ Real user accounts
✅ Secure passwords (bcrypt)
✅ JWT authentication
✅ PostgreSQL database
✅ RESTful API
✅ Frontend connected

**Happy coding!** 🚀
