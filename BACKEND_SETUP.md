# 🚀 Backend Setup Guide - Finance Tracker Application

This guide will walk you through setting up the backend for your Finance Tracker application **step by step**. Don't worry if you've never done this before - just follow along!

---

## 📦 What You Need to Install

### 1. Install PostgreSQL Database

PostgreSQL is the database that will store all your users and transactions.

**For Windows:**

1. Go to: https://www.postgresql.org/download/windows/
2. Download the installer
3. Run the installer
4. **IMPORTANT**: During installation, you'll be asked to create a password for the `postgres` user
   - Write this password down! You'll need it later
   - Example: `postgres123` or whatever you choose
5. Keep all other default settings (Port: 5432)
6. Click "Next" until installation is complete

**To verify it's installed:**

- Open Command Prompt (or PowerShell) and type:
  ```bash
  psql --version
  ```
- You should see something like: `psql (PostgreSQL) 15.x.x`

---

## 🔧 Setting Up the Backend

### Step 1: Open Terminal in the Server Folder

1. Open VS Code
2. Open a new terminal (Terminal → New Terminal or Ctrl+`)
3. Navigate to the server folder:
   ```bash
   cd server
   ```

### Step 2: Install Dependencies

This will install all the packages the backend needs (Express, PostgreSQL driver, JWT, etc.)

```bash
npm install
```

Wait for it to complete. You should see a message like "added X packages".

### Step 3: Configure Environment Variables

The `.env` file contains sensitive configuration like database password.

1. The file is already created at `server/.env`
2. **IMPORTANT**: Open it and change the password:
   ```env
   DB_PASSWORD=postgres
   ```
   Replace `postgres` with the password you created during PostgreSQL installation

### Step 4: Create the Database

Open **pgAdmin** (installed with PostgreSQL) or use command line:

**Option A: Using pgAdmin (Easier)**

1. Open pgAdmin from your Start menu
2. Enter your master password (if asked)
3. Right-click on "Databases" → Create → Database
4. Name it: `finance_tracker`
5. Click "Save"

**Option B: Using Command Line**

```bash
psql -U postgres
# Enter your password when prompted
CREATE DATABASE finance_tracker;
\q
```

### Step 5: Initialize Database Tables

This creates the `users` and `transactions` tables in your database:

```bash
npm run init-db
```

You should see:

```
✅ Users table created
✅ Transactions table created
✅ Indexes created
🎉 Database initialization complete!
```

### Step 6: Start the Backend Server

```bash
npm run dev
```

You should see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server running on port 5000
📡 Environment: development
🔗 API: http://localhost:5000/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**🎉 Congratulations! Your backend is now running!**

---

## 🧪 Testing the Backend

Let's make sure everything works!

### Test 1: Check Server Health

Open your browser and go to: http://localhost:5000/health

You should see:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-15T..."
}
```

### Test 2: Create a User Account

You can use **Thunder Client** (VS Code extension) or **Postman** to test the API.

**Install Thunder Client (Recommended):**

1. In VS Code, go to Extensions (Ctrl+Shift+X)
2. Search for "Thunder Client"
3. Click "Install"
4. Click the Thunder Client icon in the sidebar

**Test Signup:**

1. Create a new request in Thunder Client
2. Method: `POST`
3. URL: `http://localhost:5000/api/auth/signup`
4. Headers:
   - Key: `Content-Type`, Value: `application/json`
5. Body (JSON):
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```
6. Click "Send"

You should get a response with a `token` and user info!

---

## 🔗 Connecting Frontend to Backend

Your frontend is already updated to use the backend API! Here's what changed:

### What Was Updated:

1. **`src/lib/api.ts`** - New file that handles all API calls
2. **`src/lib/auth.tsx`** - Updated to use real authentication
3. **`src/lib/store.ts`** - Updated to fetch/save transactions from API

### How to Use:

1. Make sure your **backend server is running** (`npm run dev` in server folder)
2. Start your **frontend** (in the root folder):
   ```bash
   npm run dev
   ```
3. Open the app in your browser
4. Now when you sign up/login, it uses the real backend!
5. All transactions are saved to the database

---

## 🐛 Common Issues & Solutions

### Issue: "Port 5000 is already in use"

**Solution**: Either:

1. Stop the process using port 5000
2. Or change the port in `server/.env`:
   ```env
   PORT=5001
   ```
   And update frontend API URL in `src/lib/api.ts` to `http://localhost:5001/api`

### Issue: "Database connection failed"

**Solutions**:

1. Make sure PostgreSQL is running:
   - Windows: Check Services (search for "Services" in Start menu)
   - Look for "postgresql" service - it should be "Running"
2. Check your password in `server/.env`
3. Make sure the database `finance_tracker` exists

### Issue: "ECONNREFUSED" when frontend tries to connect

**Solution**: Make sure the backend server is running!

```bash
cd server
npm run dev
```

### Issue: "Cannot find module 'pg'"

**Solution**: Install dependencies again:

```bash
cd server
npm install
```

---

## 📚 API Endpoints Reference

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires token)

### Transactions (all require authentication)

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get one transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get financial summary

---

## 🎓 Understanding the Backend Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js         # Database connection
│   │   └── initDb.js          # Database setup script
│   ├── controllers/
│   │   ├── authController.js  # Login/signup logic
│   │   └── transactionController.js  # Transaction logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js    # Error handling
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── transactionRoutes.js  # Transaction endpoints
│   └── server.js              # Main server file
├── .env                       # Configuration (passwords, etc.)
├── .gitignore                 # Files to ignore in git
└── package.json               # Dependencies
```

---

## 🚀 Next Steps

1. ✅ Backend is running
2. ✅ Frontend is connected
3. ✅ Ready to use!

**Now you can:**

- Sign up for an account (stored in database!)
- Add income/expense transactions (saved to database!)
- View your financial summary
- Data persists even if you close the browser

---

## 💡 Tips

- Keep the backend terminal running while using the app
- Use Thunder Client to test API endpoints directly
- Check the PostgreSQL database using pgAdmin to see your data
- The JWT token is stored in browser localStorage
- Backend logs will show in the terminal when you use the app

---

## 🆘 Need Help?

If something doesn't work:

1. Check that PostgreSQL service is running
2. Check that backend server is running (terminal should show "Server running on port 5000")
3. Check browser console for errors (F12)
4. Check backend terminal for error messages
5. Make sure `.env` file has correct database password

---

**You did it! Your full-stack finance tracker is now complete! 🎉**
