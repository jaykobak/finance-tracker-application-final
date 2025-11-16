# Quick Start Script for Windows PowerShell
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Finance Tracker - Backend Quick Start" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$psqlInstalled = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlInstalled) {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ PostgreSQL is installed" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
$nodeVersion = node -v
Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".\server\package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Check if .env exists
Write-Host "Checking configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".\server\.env")) {
    Write-Host "⚠️  .env file not found, creating from example..." -ForegroundColor Yellow
    Copy-Item ".\server\.env.example" ".\server\.env"
    Write-Host "⚠️  Please edit server\.env and set your database password!" -ForegroundColor Red
    Write-Host ""
    $password = Read-Host "Enter your PostgreSQL password (or press Enter to skip)"
    if ($password) {
        $envContent = Get-Content ".\server\.env"
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$password"
        $envContent | Set-Content ".\server\.env"
        Write-Host "✅ Password set in .env file" -ForegroundColor Green
    }
}
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Set-Location .\server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check if database exists
Write-Host "Checking database..." -ForegroundColor Yellow
Write-Host "NOTE: You may need to create the database manually in pgAdmin" -ForegroundColor Yellow
Write-Host "Database name: finance_tracker" -ForegroundColor Cyan
Write-Host ""
$createDb = Read-Host "Do you want to try creating the database now? (y/n)"
if ($createDb -eq "y") {
    Write-Host "Attempting to create database..." -ForegroundColor Yellow
    $dbUser = "postgres"
    $dbPassword = (Get-Content ".\.env" | Select-String "DB_PASSWORD=").ToString().Split("=")[1]
    
    # This may fail if database already exists - that's okay
    $env:PGPASSWORD = $dbPassword
    psql -U $dbUser -c "CREATE DATABASE finance_tracker;" 2>$null
    $env:PGPASSWORD = ""
    
    Write-Host "Database creation attempted (errors are okay if it already exists)" -ForegroundColor Yellow
}
Write-Host ""

# Initialize database tables
Write-Host "Initializing database tables..." -ForegroundColor Yellow
npm run init-db
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to initialize database" -ForegroundColor Red
    Write-Host "Please check your database credentials in server\.env" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Database initialized" -ForegroundColor Green
Write-Host ""

Write-Host "===============================================" -ForegroundColor Green
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend server, run:" -ForegroundColor Cyan
Write-Host "  cd server" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "To start the frontend, run (in a new terminal):" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

Set-Location ..
