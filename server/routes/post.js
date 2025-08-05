const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/post/create
// @desc    Create a new post
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Post content cannot exceed 1000 characters' });
    }

    // Create new post
    const post = new Post({
      content: content.trim(),
      author: req.user._id,
      image: image || ''
    });

    await post.save();

    // Populate author information
    await post.populate('author', 'name email bio profilePicture');

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        image: post.image,
        author: {
          id: post.author._id,
          name: post.author.name,
          email: post.author.email,
          bio: post.author.bio,
          profilePicture: post.author.profilePicture
        },
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Server error creating post' });
  }
});

// @route   GET /api/post/feed
// @desc    Get all posts for home feed
// @access  Public
router.get('/feed', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name email bio profilePicture')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts: posts.map(post => ({
        id: post._id,
        content: post.content,
        image: post.image,
        author: {
          id: post.author._id,
          name: post.author.name,
          email: post.author.email,
          bio: post.author.bio,
          profilePicture: post.author.profilePicture
        },
        likes: post.likes,
        comments: post.comments,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Server error getting feed' });
  }
});

// @route   GET /api/post/user-posts/:userId
// @desc    Get posts by specific user
// @access  Public
router.get('/user-posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: userId })
      .populate('author', 'name email bio profilePicture')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ author: userId });
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts: posts.map(post => ({
        id: post._id,
        content: post.content,
        image: post.image,
        author: {
          id: post.author._id,
          name: post.author.name,
          email: post.author.email,
          bio: post.author.bio,
          profilePicture: post.author.profilePicture
        },
        likes: post.likes,
        comments: post.comments,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Server error getting user posts' });
  }
});

// @route   POST /api/post/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
      await post.save();
      
      res.json({
        message: 'Post unliked',
        liked: false,
        likesCount: post.likesCount
      });
    } else {
      // Like the post
      post.likes.push({ user: req.user._id });
      await post.save();
      
      res.json({
        message: 'Post liked',
        liked: true,
        likesCount: post.likesCount
      });
    }
  } catch (error) {
    console.error('Like/unlike post error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(500).json({ error: 'Server error liking/unliking post' });
  }
});

// @route   POST /api/post/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
      user: req.user._id,
      content: content.trim()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.user', 'name profilePicture');

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: addedComment._id,
        content: addedComment.content,
        user: {
          id: addedComment.user._id,
          name: addedComment.user.name,
          profilePicture: addedComment.user.profilePicture
        },
        createdAt: addedComment.createdAt
      },
      commentsCount: post.commentsCount
    });
  } catch (error) {
    console.error('Add comment error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(500).json({ error: 'Server error adding comment' });
  }
});

// @route   DELETE /api/post/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(500).json({ error: 'Server error deleting post' });
  }
});

module.exports = router;
