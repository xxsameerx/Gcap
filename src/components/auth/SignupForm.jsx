import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup, Row, Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const SignupForm = ({ onSuccess }) => {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    'Government Official',
    'Policy Analyst',
    'Legal Advisor',
    'Consultant',
    'Stakeholder Representative',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Organization validation
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...signupData } = formData;
      const result = await signup(signupData);
      
      if (result.success) {
        toast.success('Registration successful! Please check your email for verification.');
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="signup-form">
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaUser className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address *</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaEnvelope className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Organization *</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaBuilding className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="organization"
                placeholder="Ministry/Department/Company"
                value={formData.organization}
                onChange={handleChange}
                isInvalid={!!errors.organization}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.organization}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Role *</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              isInvalid={!!errors.role}
              disabled={isSubmitting}
            >
              <option value="">Select your role</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Password *</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaLock className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                disabled={isSubmitting}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">
              Must be 8+ characters with uppercase, lowercase, and number
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password *</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaLock className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
                disabled={isSubmitting}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="terms-agreement"
          label={
            <>
              I agree to the{' '}
              <Button variant="link" className="p-0 text-decoration-none">
                Terms of Service
              </Button>{' '}
              and{' '}
              <Button variant="link" className="p-0 text-decoration-none">
                Privacy Policy
              </Button>
            </>
          }
          required
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="w-100 btn-custom"
        disabled={isSubmitting || loading}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </Form>
  );
};

export default SignupForm;
