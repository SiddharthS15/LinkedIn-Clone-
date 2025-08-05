# LinkedIn Clone Backend

Backend API for the LinkedIn Clone application built with Node.js, Express, and MongoDB.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure your environment variables in `.env`

4. Seed demo data:
   ```bash
   npm run seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed demo user and posts

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## API Documentation

The API is available at `http://localhost:5000/api` with the following endpoints:

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/user/me` - Get current user
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/me` - Update current user
- `GET /api/user/search/:query` - Search users

### Posts
- `POST /api/post/create` - Create post
- `GET /api/post/feed` - Get feed posts
- `GET /api/post/user-posts/:userId` - Get user posts
- `POST /api/post/:id/like` - Toggle like
- `POST /api/post/:id/comment` - Add comment
- `DELETE /api/post/:id` - Delete post
