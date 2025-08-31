import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/analysis');
    }
  }, [isAuthenticated, navigate]);

  const handleSignupSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Create Your Account</h2>
                  <p className="text-muted">
                    Join the eConsultation AI platform and start analyzing stakeholder feedback
                  </p>
                </div>
                
                <SignupForm onSuccess={handleSignupSuccess} />
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Sign in here
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

export default SignupPage;
