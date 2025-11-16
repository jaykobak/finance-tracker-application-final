# Finance Tracker Backend API

This is the backend REST API for the Finance Tracker Application built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Authentication**: User registration, login with JWT tokens
- **Transaction Management**: Create, read, update, delete transactions
- **Financial Summary**: Get income, expense, and balance summaries
- **Secure**: Password hashing with bcrypt, JWT authentication
- **Database**: PostgreSQL with proper indexing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)

## 🛠️ Installation Steps

### Step 1: Install PostgreSQL

1. **Windows**: Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation, remember your password for the `postgres` user
3. PostgreSQL should run on port `5432` by default

### Step 2: Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE finance_tracker;
```

### Step 3: Install Dependencies

Navigate to the server folder and install packages:

```bash
cd server
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `server` folder:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_HOST=localhost
DB_NAME=finance_tracker
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d
```

**Important**: Replace `your_postgres_password` with your actual PostgreSQL password!

### Step 5: Initialize Database Tables

Run the database initialization script:

```bash
npm run init-db
```

This will create the `users` and `transactions` tables.

### Step 6: Start the Server

Start the development server:

```bash
npm run dev
```

You should see:

```
🚀 Server running on port 5000
📡 Environment: development
🔗 API: http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile

```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Transactions

All transaction endpoints require authentication (JWT token in Authorization header).

#### Get All Transactions

```http
GET /api/transactions
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Transaction by ID

```http
GET /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Transaction

```http
POST /api/transactions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "type": "income",
  "amount": 5000,
  "description": "Salary",
  "category": "Work",
  "date": "2025-11-15T00:00:00.000Z"
}
```

#### Update Transaction

```http
PUT /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 5500,
  "description": "Updated Salary"
}
```

#### Delete Transaction

```http
DELETE /api/transactions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Financial Summary

```http
GET /api/transactions/summary
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ Database Schema

### Users Table

```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Transactions Table

```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER - Foreign Key to users)
- type (VARCHAR - 'income' or 'expense')
- amount (DECIMAL)
- description (VARCHAR)
- category (VARCHAR)
- date (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🧪 Testing the API

You can test the API using:

1. **Postman** - [Download](https://www.postman.com/downloads/)
2. **Thunder Client** (VS Code Extension)
3. **curl** commands

Example with curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected routes with authentication middleware
- Helmet.js for security headers
- Input validation
- SQL injection protection (parameterized queries)

## 🐛 Troubleshooting

### Database Connection Error

- Make sure PostgreSQL is running
- Check your database credentials in `.env`
- Ensure the database `finance_tracker` exists

### Port Already in Use

- Change the PORT in `.env` file
- Or kill the process using port 5000

### Token Expired

- Login again to get a new token
- Or increase `JWT_EXPIRES_IN` in `.env`

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database tables

## 🚀 Next Steps

Now that your backend is running, you need to connect your frontend to use this API instead of localStorage. Update your frontend files to make HTTP requests to these endpoints!
