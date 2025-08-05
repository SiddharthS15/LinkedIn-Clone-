@echo off
echo ====================================
echo LinkedIn Clone - Setup Script
echo ====================================
echo.

echo Step 1: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install server dependencies
    pause
    exit /b 1
)
echo ✅ Server dependencies installed successfully
echo.

echo Step 2: Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo ✅ Environment file created (.env)
    echo ⚠️  IMPORTANT: Please edit server\.env file with your MongoDB connection string
    echo.
) else (
    echo ✅ Environment file already exists
    echo.
)

echo Step 3: Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install client dependencies
    pause
    exit /b 1
)
echo ✅ Client dependencies installed successfully
echo.

echo Step 4: Testing database connection...
cd ..\server
call npm run test-db
if %errorlevel% neq 0 (
    echo ⚠️  Database connection test failed
    echo Please check your MongoDB setup and .env configuration
    echo See MONGODB_SETUP.md for detailed instructions
    echo.
) else (
    echo ✅ Database connection successful
    echo.
    
    echo Step 5: Seeding demo data...
    call npm run seed
    if %errorlevel% neq 0 (
        echo ⚠️  Failed to seed demo data
    ) else (
        echo ✅ Demo data seeded successfully
        echo.
    )
)

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is configured in server\.env
echo 2. Start the backend: cd server && npm run dev
echo 3. Start the frontend: cd client && npm start
echo 4. Visit http://localhost:3000
echo 5. Login with demo account: demo@linkedin.com / demo123
echo.
echo For MongoDB setup help, see MONGODB_SETUP.md
echo.
pause
