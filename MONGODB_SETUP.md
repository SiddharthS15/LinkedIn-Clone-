# MongoDB Setup Guide for LinkedIn Clone

## 🌟 Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com/
2. Sign up for a free account
3. Verify your email address

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free tier)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Name your cluster (e.g., "linkedin-clone")
6. Click "Create Cluster"

### Step 3: Create Database User
1. In the Security section, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. In the Security section, click "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Or add your current IP address for better security
5. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace <password> with your actual password
6. Replace <dbname> with "linkedin_clone"

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/linkedin_clone?retryWrites=true&w=majority
```

### Step 6: Update Environment File
Add your connection string to `server/.env`:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.abc123.mongodb.net/linkedin_clone?retryWrites=true&w=majority
```

## 🏠 Option 2: Local MongoDB Installation

### Windows Installation
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and choose "Complete" installation
3. Install MongoDB as a service
4. Start MongoDB service

### macOS Installation
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux Installation
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Local Connection String
For local MongoDB, use:
```
MONGODB_URI=mongodb://localhost:27017/linkedin_clone
```

## 🧪 Testing Your Connection

### Step 1: Create Environment File
```bash
cd server
cp .env.example .env
```

### Step 2: Edit Environment File
Open `server/.env` and add your MongoDB URI:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/linkedin_clone?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development
```

### Step 3: Test Connection
```bash
cd server
npm install
npm run test-db
```

You should see:
```
✅ Successfully connected to MongoDB Atlas!
🎉 All tests passed! Your MongoDB setup is working correctly.
```

## 🚀 Quick Start Commands

### Full Setup
```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI

# 4. Test database connection
npm run test-db

# 5. Seed demo data
npm run seed

# 6. Start development server
npm run dev
```

### Start Frontend
```bash
# In a new terminal
cd client
npm install
npm start
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Failed
```
Error: authentication failed
```
**Solution:**
- Check username/password in connection string
- Verify database user exists in MongoDB Atlas
- Ensure user has proper permissions

#### 2. Network Error
```
Error: network timeout
```
**Solution:**
- Check internet connection
- Verify IP address is whitelisted in MongoDB Atlas
- Check firewall settings

#### 3. Environment Variable Missing
```
Error: MONGODB_URI environment variable is not set
```
**Solution:**
- Create `.env` file in server directory
- Add `MONGODB_URI=your_connection_string`

#### 4. Database Not Found
**Solution:**
- MongoDB will create the database automatically when first document is inserted
- Run `npm run seed` to create initial data

## 📊 Database Structure

The application will create these collections:
- `users` - User profiles and authentication
- `posts` - User posts and content
- `sessions` - JWT token management (if using sessions)

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use strong passwords** for database users
3. **Whitelist specific IPs** in production
4. **Use different databases** for development/production
5. **Regular backups** for production data

## 📝 Environment Variables Explained

```env
# Server Configuration
PORT=5000                    # Port for Express server
NODE_ENV=development        # Environment mode

# Database Configuration
MONGODB_URI=mongodb+srv://   # Your MongoDB connection string

# Authentication
JWT_SECRET=your_secret_key   # Secret for JWT tokens (make it long!)
```

## 🎯 Next Steps

After MongoDB is set up:
1. ✅ Test database connection
2. ✅ Seed demo data
3. ✅ Start backend server
4. ✅ Start frontend application
5. ✅ Test with demo account: demo@linkedin.com / demo123

## 💡 Pro Tips

- Use MongoDB Compass for visual database management
- Enable MongoDB Atlas monitoring for performance insights
- Consider using separate databases for development and production
- Set up automated backups for production data
