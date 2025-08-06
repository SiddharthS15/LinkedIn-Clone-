import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatRelativeTime, getInitials, stringToColor } from '../utils/helpers';
import { postAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onPostUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if current user liked the post
  const isLiked = post.likes?.some(like => like.user === user?.id);

  const handleLike = async () => {
    try {
      const response = await postAPI.toggleLike(post.id);
      
      // Update the post in parent component
      if (onPostUpdate) {
        const updatedPost = {
          ...post,
          likes: response.liked 
            ? [...post.likes, { user: user.id, createdAt: new Date() }]
            : post.likes.filter(like => like.user !== user.id),
          likesCount: response.likesCount
        };
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('Failed to update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await postAPI.addComment(post.id, newComment.trim());
      
      // Update the post with new comment
      if (onPostUpdate) {
        const updatedPost = {
          ...post,
          comments: [...post.comments, response.comment],
          commentsCount: response.commentsCount
        };
        onPostUpdate(updatedPost);
      }
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.error || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const ProfilePicture = ({ user, size = 'sm' }) => {
    const sizeClass = size === 'lg' ? 'profile-picture-large' : 
                     size === 'md' ? 'profile-picture-medium' :
                     size === 'sm' ? 'profile-picture-small' : 'profile-picture';
    
    const containerSizeClass = size === 'lg' ? 'large' : 
                              size === 'md' ? 'medium' :
                              size === 'sm' ? 'small' : 'small';
    
    if (user.profilePicture) {
      return (
        <div className={`profile-picture-container ${containerSizeClass}`}>
          <img 
            src={user.profilePicture} 
            alt={user.name}
            className={sizeClass}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      );
    }
    
    return (
      <div className={`profile-picture-container ${containerSizeClass}`}>
        <div 
          className={`profile-initials ${containerSizeClass}`}
          style={{ 
            backgroundColor: stringToColor(user.name || ''),
          }}
        >
          {getInitials(user.name)}
        </div>
      </div>
    );
  };

  return (
    <Card className="post-card">
      <Card.Body className="p-3">
        {/* Post Header */}
        <div className="post-header d-flex align-items-start">
          <ProfilePicture user={post.author} size="md" />
          <div className="ms-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Link 
                  to={`/user/${post.author.id}`}
                  className="post-author-name"
                >
                  {post.author.name}
                </Link>
                {post.author.bio && (
                  <div className="post-author-title">{post.author.bio}</div>
                )}
                <div className="post-time d-flex align-items-center">
                  {formatRelativeTime(post.createdAt)} • 🌐
                </div>
              </div>
              <div className="dropdown">
                <button 
                  className="btn btn-sm" 
                  style={{ color: 'rgba(0,0,0,0.6)', background: 'none', border: 'none' }}
                >
                  ⋯
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="post-content mt-2">
          {post.content}
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="mt-3">
            <img 
              src={post.image} 
              alt="Post content" 
              className="img-fluid rounded"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Post Stats */}
        {(post.likesCount > 0 || post.commentsCount > 0) && (
          <div className="post-stats mt-3">
            <div className="post-stats-left">
              {post.likesCount > 0 && (
                <>
                  <div className="engagement-icons">
                    <div className="engagement-icon like-icon">👍</div>
                    <div className="engagement-icon love-icon">❤️</div>
                    <div className="engagement-icon celebrate-icon">🎉</div>
                  </div>
                  <span>{post.likesCount}</span>
                </>
              )}
            </div>
            <div className="post-stats-right d-flex gap-3">
              {post.commentsCount > 0 && (
                <span 
                  onClick={() => setShowComments(!showComments)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="post-actions">
          <div className="d-flex justify-content-around">
            <button 
              className={`post-action-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <span className="reaction-icon">👍</span>
              Like
            </button>
            <button 
              className="post-action-btn"
              onClick={() => setShowComments(!showComments)}
            >
              <span className="reaction-icon">💬</span>
              Comment
            </button>
            <button className="post-action-btn">
              <span className="reaction-icon">🔄</span>
              Repost
            </button>
            <button className="post-action-btn">
              <span className="reaction-icon">📤</span>
              Send
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="comment-section">
            {error && (
              <Alert variant="danger" className="alert-custom">
                {error}
              </Alert>
            )}
            
            {/* Add Comment */}
            <Form onSubmit={handleComment} className="mb-3">
              <div className="d-flex align-items-start">
                <ProfilePicture user={user} size="sm" />
                <div className="ms-2 flex-grow-1">
                  <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={loading}
                    style={{ 
                      resize: 'none',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '24px',
                      padding: '8px 16px',
                      fontSize: '0.875rem'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment(e);
                      }
                    }}
                  />
                  {newComment.trim() && (
                    <div className="d-flex justify-content-end mt-2">
                      <Button 
                        type="submit" 
                        variant="linkedin" 
                        size="sm"
                        disabled={loading || !newComment.trim()}
                        style={{ borderRadius: '16px', fontSize: '0.75rem', padding: '4px 16px' }}
                      >
                        {loading ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Form>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div>
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment-item d-flex align-items-start">
                    <ProfilePicture user={comment.user} size="sm" />
                    <div className="ms-2 flex-grow-1">
                      <div className="comment-author">{comment.user.name}</div>
                      <div className="comment-content">{comment.content}</div>
                      <div className="comment-time d-flex align-items-center gap-3">
                        <span>{formatRelativeTime(comment.createdAt)}</span>
                        <button className="btn btn-sm p-0" style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)' }}>
                          Like
                        </button>
                        <button className="btn btn-sm p-0" style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.6)' }}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PostCard;
