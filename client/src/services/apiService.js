import api from './api';

// Post API functions
export const postAPI = {
  // Create a new post
  createPost: async (content, image = '') => {
    const response = await api.post('/post/create', { content, image });
    return response.data;
  },

  // Get feed posts
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/post/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get posts by user ID
  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/post/user-posts/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Like/unlike a post
  toggleLike: async (postId) => {
    const response = await api.post(`/post/${postId}/like`);
    return response.data;
  },

  // Add comment to post
  addComment: async (postId, content) => {
    const response = await api.post(`/post/${postId}/comment`, { content });
    return response.data;
  },

  // Delete a post
  deletePost: async (postId) => {
    const response = await api.delete(`/post/${postId}`);
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // Update current user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/me', profileData);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await api.get(`/user/search/${query}`);
    return response.data;
  },
};

// Auth API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register user
  register: async (name, email, password, bio = '') => {
    const response = await api.post('/auth/register', { name, email, password, bio });
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};
