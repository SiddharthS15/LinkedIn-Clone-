import React, { useState, useRef, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Sample search suggestions (in a real app, these would come from an API)
  const sampleSuggestions = [
    { type: 'recent', text: 'web developer', icon: 'fas fa-clock' },
    { type: 'recent', text: 'react developer', icon: 'fas fa-clock' },
    { type: 'recent', text: 'frontend engineer', icon: 'fas fa-clock' },
    { type: 'suggestion', text: 'software engineer', icon: 'fas fa-search' },
    { type: 'suggestion', text: 'product manager', icon: 'fas fa-search' },
    { type: 'suggestion', text: 'data scientist', icon: 'fas fa-search' },
    { type: 'suggestion', text: 'ui/ux designer', icon: 'fas fa-search' },
    { type: 'people', text: 'John Doe', icon: 'fas fa-user', subtitle: 'Software Engineer at TechCorp' },
    { type: 'people', text: 'Sarah Johnson', icon: 'fas fa-user', subtitle: 'Product Manager at InnovateTech' },
    { type: 'companies', text: 'TechCorp', icon: 'fas fa-building', subtitle: 'Technology Company' },
    { type: 'companies', text: 'InnovateTech', icon: 'fas fa-building', subtitle: 'AI/ML Startup' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      // Filter suggestions based on query
      const filtered = sampleSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 8)); // Show max 8 suggestions
      setShowSuggestions(true);
    } else {
      setSearchSuggestions(sampleSuggestions.slice(0, 8));
      setShowSuggestions(searchFocused);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setShowSuggestions(true);
    if (searchQuery.length === 0) {
      setSearchSuggestions(sampleSuggestions.slice(0, 8));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    setSearchFocused(false);
    // Here you would typically navigate to search results or perform search
    console.log('Search for:', suggestion.text);
  };

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
          <div className="search-container" ref={searchRef}>
            <Form className="d-none d-md-flex mx-auto">
              <InputGroup className={`search-input-group ${searchFocused ? 'focused' : ''}`}>
                <InputGroup.Text className="search-icon">
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="search-input"
                />
              </InputGroup>
              
              {showSuggestions && (
                <div className="search-suggestions">
                  <div className="suggestions-header">
                    <div className="suggestions-section">
                      {searchQuery.length > 0 && (
                        <div className="suggestion-item search-for">
                          <i className="fas fa-search"></i>
                          <span>Search for "<strong>{searchQuery}</strong>"</span>
                        </div>
                      )}
                      
                      {searchQuery.length === 0 && (
                        <>
                          <div className="suggestions-title">Recent</div>
                          {searchSuggestions.filter(s => s.type === 'recent').map((suggestion, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <i className={suggestion.icon}></i>
                              <span>{suggestion.text}</span>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {searchQuery.length > 0 && (
                        <>
                          <div className="suggestions-title">Try searching for</div>
                          {searchSuggestions.map((suggestion, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <i className={suggestion.icon}></i>
                              <div className="suggestion-content">
                                <span className="suggestion-text">{suggestion.text}</span>
                                {suggestion.subtitle && (
                                  <span className="suggestion-subtitle">{suggestion.subtitle}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Form>
          </div>
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
                  <span className="notification-badge">4</span>
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

              <div className="nav-divider"></div>

              <Nav.Link 
                onClick={toggleTheme}
                className="nav-item-custom theme-toggle"
                style={{ cursor: 'pointer' }}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                <div className="nav-icon-container">
                  <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                </div>
                <span className="nav-text">{isDark ? 'Light' : 'Dark'}</span>
              </Nav.Link>

              <Nav.Link className="nav-item-custom work-dropdown">
                <div className="nav-icon-container">
                  <i className="fas fa-briefcase"></i>
                </div>
                <span className="nav-text">Business</span>
              </Nav.Link>

              <Nav.Link 
                onClick={handleLogout}
                className="nav-item-custom logout-item"
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
