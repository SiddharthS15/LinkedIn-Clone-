# LinkedIn Clone - Full-Stack Professional Network

A modern, full-stack web application inspired by LinkedIn, built with React, Node.js, Express, and MongoDB. This platform allows users to create profiles, share posts, and build their professional network.

![LinkedIn Clone](https://img.shields.io/badge/LinkedIn-Clone-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🚀 Features

### Authentication & Authorization
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes and middleware
- ✅ Secure password hashing with bcrypt

### User Management
- ✅ User profiles with bio, location, and website
- ✅ Profile editing functionality
- ✅ Profile picture placeholders with initials
- ✅ User search functionality

### Posts & Feed
- ✅ Create and share posts (up to 1000 characters)
- ✅ Public home feed with all posts
- ✅ User-specific post feeds
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ Real-time interaction counts

### Additional Features
- ✅ Responsive design with Bootstrap
- ✅ Loading states and error handling
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ Timestamp formatting with moment.js
- ✅ Demo account for testing

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with functional components and hooks
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework for responsive design
- **Axios** - HTTP client for API calls
- **Moment.js** - Date/time formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (recommended) OR local MongoDB installation

### Quick Setup (Automated)

#### Windows
```bash
# Run the setup script
setup.bat
```

#### Linux/macOS
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Manual Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LinkedIn
```

### 2. MongoDB Setup
**Option A: MongoDB Atlas (Recommended)**
1. Create free account at https://cloud.mongodb.com/
2. Create a new cluster (M0 Sandbox - Free tier)
3. Create database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and replace password/database name

**Option B: Local MongoDB**
- Install MongoDB Community Server on your system
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/linkedin_clone`

📋 **Detailed MongoDB setup guide:** See [MONGODB_SETUP.md](MONGODB_SETUP.md)

### 3. Backend Setup
```bash
cd server
npm install
```

### 4. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/linkedin_clone?retryWrites=true&w=majority
# JWT_SECRET=your_super_secret_jwt_key_here
# PORT=5000
# NODE_ENV=development
```

### 5. Test Database Connection
```bash
npm run test-db
```
You should see: ✅ Successfully connected to MongoDB Atlas!

### 6. Seed Demo Data
```bash
npm run seed
```

### 7. Start Backend Server
```bash
npm run dev
```
The server will start on http://localhost:5000

### 8. Frontend Setup (New Terminal)
```bash
cd client
npm install
npm start
```
The React app will start on http://localhost:3000

## 🔐 Demo Account

For testing purposes, use these credentials:
- **Email:** demo@linkedin.com
- **Password:** demo123

Or click the "Use Demo Account" button on the login page.

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/user/me` - Get current user profile
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/me` - Update current user profile
- `GET /api/user/search/:query` - Search users

### Posts
- `POST /api/post/create` - Create a new post
- `GET /api/post/feed` - Get home feed posts
- `GET /api/post/user-posts/:userId` - Get posts by user
- `POST /api/post/:id/like` - Like/unlike a post
- `POST /api/post/:id/comment` - Add comment to post
- `DELETE /api/post/:id` - Delete a post

## 🎨 Frontend Routes

- `/` - Home feed (protected)
- `/login` - Login page
- `/register` - Registration page
- `/profile` - Current user profile (protected)
- `/user/:userId` - View other user's profile (protected)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Controlled cross-origin requests
- **Security Headers** - Helmet.js for security headers
- **Error Handling** - Comprehensive error handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the production version:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to Vercel or Netlify
3. Update the API base URL in production

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command: `cd server && npm install`
4. Set the start command: `cd server && npm start`
5. Add environment variables in Render dashboard

### Database
- MongoDB Atlas is already cloud-hosted
- Ensure your connection string is properly configured

## 📂 Project Structure

```
LinkedIn/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Utility scripts
│   ├── server.js           # Entry point
│   └── package.json
└── README.md
```

## 🧪 Testing

### Manual Testing
1. Register a new account
2. Login with demo credentials
3. Create posts and interact with them
4. Test profile editing
5. Navigate between different user profiles

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@linkedin.com","password":"demo123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by LinkedIn's professional networking platform
- Built with modern web technologies and best practices
- Thanks to the open-source community for the amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Networking! 🌐**
