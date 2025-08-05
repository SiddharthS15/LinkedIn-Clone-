import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Button, Container } from 'react-bootstrap';
import { postAPI } from '../services/apiService';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError('');
      
      const response = await postAPI.getFeed(pageNum, 10);
      
      if (append) {
        setPosts(prev => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts);
      }
      
      setHasMore(response.pagination.hasNextPage);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const loadMorePosts = () => {
    fetchPosts(page + 1, true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your feed..." />;
  }

  return (
    <Container fluid style={{ backgroundColor: '#f4f2ee', minHeight: '100vh', paddingTop: '24px' }}>
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={10}>
          <div className="main-content">
            {/* Create Post */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="alert-custom">
                {error}
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => fetchPosts()}
                  className="ms-2"
                >
                  Try Again
                </Button>
              </Alert>
            )}

            {/* Posts List */}
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h5 className="text-muted">No posts in your feed yet</h5>
                <p className="text-muted">
                  Start following people or create your first post to see content here!
                </p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onPostUpdate={handlePostUpdate}
                  />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline-linkedin" 
                      onClick={loadMorePosts}
                      disabled={loadingMore}
                      style={{ borderRadius: '24px', fontWeight: '600' }}
                    >
                      {loadingMore ? 'Loading more posts...' : 'Show more posts'}
                    </Button>
                  </div>
                )}

                {!hasMore && posts.length > 0 && (
                  <div className="text-center mt-4 mb-4">
                    <div style={{ 
                      padding: '24px', 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉</div>
                      <h6 className="text-muted">You're all caught up!</h6>
                      <small className="text-muted">
                        You've seen all the posts in your feed. Check back later for more updates.
                      </small>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
