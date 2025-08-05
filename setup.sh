#!/bin/bash

echo "===================================="
echo "LinkedIn Clone - Setup Script"
echo "===================================="
echo

echo "Step 1: Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install server dependencies"
    exit 1
fi
echo "✅ Server dependencies installed successfully"
echo

echo "Step 2: Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created (.env)"
    echo "⚠️  IMPORTANT: Please edit server/.env file with your MongoDB connection string"
    echo
else
    echo "✅ Environment file already exists"
    echo
fi

echo "Step 3: Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install client dependencies"
    exit 1
fi
echo "✅ Client dependencies installed successfully"
echo

echo "Step 4: Testing database connection..."
cd ../server
npm run test-db
if [ $? -ne 0 ]; then
    echo "⚠️  Database connection test failed"
    echo "Please check your MongoDB setup and .env configuration"
    echo "See MONGODB_SETUP.md for detailed instructions"
    echo
else
    echo "✅ Database connection successful"
    echo
    
    echo "Step 5: Seeding demo data..."
    npm run seed
    if [ $? -ne 0 ]; then
        echo "⚠️  Failed to seed demo data"
    else
        echo "✅ Demo data seeded successfully"
        echo
    fi
fi

echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo
echo "Next steps:"
echo "1. Make sure MongoDB is configured in server/.env"
echo "2. Start the backend: cd server && npm run dev"
echo "3. Start the frontend: cd client && npm start"
echo "4. Visit http://localhost:3000"
echo "5. Login with demo account: demo@linkedin.com / demo123"
echo
echo "For MongoDB setup help, see MONGODB_SETUP.md"
echo
