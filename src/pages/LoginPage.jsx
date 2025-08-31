import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/analysis');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/analysis');
  };

  // Quick login for testing
  const handleQuickLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      navigate('/analysis');
    }
  };

  return (
    <div className="auth-page bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7} sm={9}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-muted">
                    Sign in to access your eConsultation AI dashboard
                  </p>
                </div>
                
                {/* Quick Test Login Buttons */}
                <Alert variant="info" className="mb-4">
                  <strong>🚀 Quick Test Login:</strong>
                  <div className="mt-2 d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleQuickLogin('admin@econsultation.gov.in', 'admin123')}
                    >
                      Login as Admin User
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => handleQuickLogin('test@gov.in', 'test123')}
                    >
                      Login as Test Officer
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm"
                      onClick={() => handleQuickLogin('demo@mca.gov.in', 'demo123')}
                    >
                      Login as Demo User
                    </Button>
                  </div>
                </Alert>
                
                <LoginForm onSuccess={handleLoginSuccess} />
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-decoration-none fw-semibold">
                      Create one here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-muted text-decoration-none">
                ← Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
