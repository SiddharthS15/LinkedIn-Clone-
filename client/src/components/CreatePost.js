import React, { useState } from 'react';
import { Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { postAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { getInitials, stringToColor } from '../utils/helpers';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content for your post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await postAPI.createPost(content.trim());
      setContent('');
      setShowModal(false);
      if (onPostCreated) {
        onPostCreated(response.post);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const ProfilePicture = ({ user, size = 'sm' }) => {
    const sizeClass = size === 'lg' ? 'profile-picture-large' : 
                     size === 'sm' ? 'profile-picture-small' : 'profile-picture';
    
    if (user.profilePicture) {
      return (
        <img 
          src={user.profilePicture} 
          alt={user.name}
          className={sizeClass}
        />
      );
    }
    
    return (
      <div 
        className={`${sizeClass} d-flex align-items-center justify-content-center`}
        style={{ 
          backgroundColor: stringToColor(user.name || ''),
          color: 'white',
          fontWeight: 'bold',
          fontSize: size === 'lg' ? '3rem' : size === 'sm' ? '0.75rem' : '1rem'
        }}
      >
        {getInitials(user.name)}
      </div>
    );
  };

  return (
    <>
      <Card className="create-post-card">
        <Card.Body className="p-3">
          <div className="d-flex align-items-center gap-3">
            <ProfilePicture user={user} />
            <div 
              className="create-post-prompt flex-grow-1"
              onClick={() => setShowModal(true)}
            >
              Start a post, try writing with AI
            </div>
          </div>
          
          <div className="d-flex justify-content-around mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <button 
              className="btn d-flex align-items-center gap-2 text-muted"
              style={{ background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: '600' }}
              onClick={() => setShowModal(true)}
            >
              <span style={{ fontSize: '1.2rem' }}>🖼️</span>
              Media
            </button>
            <button 
              className="btn d-flex align-items-center gap-2 text-muted"
              style={{ background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: '600' }}
              onClick={() => setShowModal(true)}
            >
              <span style={{ fontSize: '1.2rem' }}>📅</span>
              Event
            </button>
            <button 
              className="btn d-flex align-items-center gap-2 text-muted"
              style={{ background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: '600' }}
              onClick={() => setShowModal(true)}
            >
              <span style={{ fontSize: '1.2rem' }}>📝</span>
              Write article
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* Create Post Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="d-flex align-items-center gap-3">
            <ProfilePicture user={user} />
            <div>
              <Modal.Title style={{ fontSize: '1rem', margin: 0 }}>{user?.name}</Modal.Title>
              <small className="text-muted">Post to anyone</small>
            </div>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ padding: '24px' }}>
            {error && (
              <Alert variant="danger" className="alert-custom">
                {error}
              </Alert>
            )}
            
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="What do you want to talk about?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                disabled={loading}
                style={{
                  border: 'none',
                  resize: 'none',
                  fontSize: '1.125rem',
                  lineHeight: '1.5',
                  padding: 0
                }}
              />
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex gap-3">
                  <button 
                    type="button"
                    className="btn"
                    style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', fontSize: '1.5rem' }}
                  >
                    📷
                  </button>
                  <button 
                    type="button"
                    className="btn"
                    style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', fontSize: '1.5rem' }}
                  >
                    🎥
                  </button>
                  <button 
                    type="button"
                    className="btn"
                    style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', fontSize: '1.5rem' }}
                  >
                    📊
                  </button>
                  <button 
                    type="button"
                    className="btn"
                    style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', fontSize: '1.5rem' }}
                  >
                    😊
                  </button>
                </div>
                <small className="text-muted">
                  {content.length}/1000
                </small>
              </div>
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '16px 24px' }}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.6)' }}>⏰</span>
                <small className="text-muted">Schedule for later</small>
              </div>
              <Button 
                type="submit" 
                variant="linkedin"
                disabled={loading || !content.trim()}
                style={{ borderRadius: '24px', fontWeight: '600' }}
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreatePost;
