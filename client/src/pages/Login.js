import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@linkedin.com',
      password: 'demo123'
    });
    setError('');
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={4}>
        <Card>
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="text-linkedin">Welcome Back</h2>
              <p className="text-muted">Sign in to your LinkedIn Clone account</p>
            </div>

            {error && (
              <Alert variant="danger" className="alert-custom">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Button 
                type="submit" 
                variant="linkedin" 
                size="lg" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>

            <div className="text-center">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={fillDemoCredentials}
                className="mb-3"
                disabled={loading}
              >
                Use Demo Account
              </Button>
            </div>

            <hr />

            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-linkedin">
                  Sign up here
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Demo Account Info */}
        <Card className="mt-3">
          <Card.Body className="text-center">
            <h6 className="text-muted">Demo Account</h6>
            <small className="text-muted">
              <strong>Email:</strong> demo@linkedin.com<br />
              <strong>Password:</strong> demo123
            </small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
