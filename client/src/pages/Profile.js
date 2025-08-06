import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/apiService';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getInitials, stringToColor } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch current user profile and posts
      const [userResponse, postsResponse] = await Promise.all([
        userAPI.getCurrentUser(),
        postAPI.getUserPosts(user.id)
      ]);
      
      // Update user data in auth context
      updateUser(userResponse.user);
      
      // Set form data for editing
      setEditFormData({
        name: userResponse.user.name || '',
        bio: userResponse.user.bio || '',
        location: userResponse.user.location || '',
        website: userResponse.user.website || ''
      });
      
      setUserPosts(postsResponse.posts);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    setEditLoading(true);
    setEditError('');
    
    try {
      const response = await userAPI.updateProfile(editFormData);
      updateUser(response.user);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setEditError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setEditLoading(false);
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
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          {error && (
            <Alert variant="danger" className="alert-custom">
              {error}
              <Button 
                variant="link" 
                size="sm" 
                onClick={fetchUserData}
                className="ms-2"
              >
                Try Again
              </Button>
            </Alert>
          )}

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
                            🌐 <a href={user.website} target="_blank" rel="noopener noreferrer">
                              {user.website}
                            </a>
                          </span>
                        )}
                        <span>📅 Member since {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline-linkedin" 
                      onClick={() => setShowEditModal(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Posts Section */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Posts ({userPosts.length})</h5>
            </Card.Header>
            <Card.Body>
              {userPosts.length === 0 ? (
                <div className="text-center py-4">
                  <h6 className="text-muted">No posts yet</h6>
                  <p className="text-muted">
                    Share your first post to get started!
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

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editError && (
              <Alert variant="danger" className="alert-custom">
                {editError}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  name: e.target.value
                })}
                required
                disabled={editLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editFormData.bio}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  bio: e.target.value
                })}
                maxLength={500}
                disabled={editLoading}
              />
              <Form.Text className="text-muted">
                {editFormData.bio.length}/500 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.location}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  location: e.target.value
                })}
                placeholder="e.g., San Francisco, CA"
                disabled={editLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                value={editFormData.website}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  website: e.target.value
                })}
                placeholder="e.g., https://yourwebsite.com"
                disabled={editLoading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="linkedin" 
              type="submit"
              disabled={editLoading}
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
