import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { userAPI, postAPI } from '../services/apiService';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getInitials, stringToColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user profile and posts
      const [userResponse, postsResponse] = await Promise.all([
        userAPI.getUserById(userId),
        postAPI.getUserPosts(userId)
      ]);
      
      setUser(userResponse.user);
      setUserPosts(postsResponse.posts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load user profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setUserPosts(prev => 
      prev.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const ProfilePicture = ({ user, size = 'lg' }) => {
    const sizeClass = size === 'lg' ? 'profile-picture-large' : 'profile-picture';
    
    const containerSizeClass = size === 'lg' ? 'large' : 'small';
    
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

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (error) {
    return (
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Alert variant="danger" className="alert-custom text-center">
            <h5>{error}</h5>
            <Button 
              variant="linkedin" 
              onClick={fetchUserProfile}
              className="mt-2"
            >
              Try Again
            </Button>
          </Alert>
        </Col>
      </Row>
    );
  }

  if (!user) {
    return null;
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <Row className="justify-content-center">
      <Col lg={8} md={10}>
        {/* Profile Header */}
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-start">
              <ProfilePicture user={user} size="lg" />
              <div className="ms-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h2 className="mb-1">{user.name}</h2>
                    <p className="text-muted mb-2">{user.email}</p>
                    {user.bio && (
                      <p className="mb-2">{user.bio}</p>
                    )}
                    <div className="text-muted small">
                      {user.location && (
                        <span className="me-3">📍 {user.location}</span>
                      )}
                      {user.website && (
                        <span className="me-3">
                          🌐 <a 
                            href={user.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-linkedin"
                          >
                            {user.website}
                          </a>
                        </span>
                      )}
                      <span>📅 Member since {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <div className="text-muted small">
                      This is your profile
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Posts Section */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              {isOwnProfile ? 'My Posts' : `${user.name}'s Posts`} ({userPosts.length})
            </h5>
          </Card.Header>
          <Card.Body>
            {userPosts.length === 0 ? (
              <div className="text-center py-4">
                <h6 className="text-muted">No posts yet</h6>
                <p className="text-muted">
                  {isOwnProfile 
                    ? 'Share your first post to get started!' 
                    : `${user.name} hasn't shared any posts yet.`
                  }
                </p>
              </div>
            ) : (
              userPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onPostUpdate={handlePostUpdate}
                />
              ))
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UserProfile;
