import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      style={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '8px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1020,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
      }}
    >
      <Container>
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/"
          style={{ 
            color: '#0a66c2', 
            fontWeight: 'bold', 
            fontSize: '28px',
            textDecoration: 'none'
          }}
        >
          <i className="fab fa-linkedin" style={{ marginRight: '8px' }}></i>
          LinkedInClone
        </BootstrapNavbar.Brand>

        {isAuthenticated && (
          <Form className="d-none d-md-flex mx-auto" style={{ maxWidth: '280px', width: '100%' }}>
            <InputGroup>
              <InputGroup.Text style={{ 
                backgroundColor: '#eef3f8', 
                border: '1px solid #e0e0e0',
                borderRight: 'none'
              }}>
                <i className="fas fa-search" style={{ color: '#666' }}></i>
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search"
                style={{
                  backgroundColor: '#eef3f8',
                  border: '1px solid #e0e0e0',
                  borderLeft: 'none',
                  fontSize: '14px'
                }}
              />
            </InputGroup>
          </Form>
        )}

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link as={Link} to="/" className="nav-item-custom">
                <div className="nav-icon-container">
                  <i className="fas fa-home"></i>
                </div>
                <span className="nav-text">Home</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/network" className="nav-item-custom">
                <div className="nav-icon-container">
                  <i className="fas fa-user-friends"></i>
                </div>
                <span className="nav-text">My Network</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/messaging" className="nav-item-custom">
                <div className="nav-icon-container">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <span className="nav-text">Messaging</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/notifications" className="nav-item-custom">
                <div className="nav-icon-container">
                  <i className="fas fa-bell"></i>
                </div>
                <span className="nav-text">Notifications</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/profile" className="nav-item-custom">
                <div className="nav-icon-container">
                  <div className="profile-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <span className="nav-text">Me</span>
              </Nav.Link>

              <Nav.Link 
                onClick={handleLogout}
                className="nav-item-custom"
                style={{ cursor: 'pointer' }}
              >
                <div className="nav-icon-container">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <span className="nav-text">Sign out</span>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link 
                as={Link} 
                to="/login"
                style={{ 
                  color: '#0a66c2', 
                  fontWeight: '600',
                  marginRight: '16px'
                }}
              >
                Sign in
              </Nav.Link>
              <Button 
                as={Link}
                to="/register"
                variant="outline-linkedin" 
                size="sm"
                style={{
                  borderRadius: '24px',
                  fontWeight: '600',
                  padding: '8px 24px',
                  textDecoration: 'none'
                }}
              >
                Join now
              </Button>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
