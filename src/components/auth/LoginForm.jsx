import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginForm = ({ onSuccess }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful! Welcome back.');
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
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

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <FaLock className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
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
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="remember-me"
          label="Remember me"
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
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center mt-3">
        <Button variant="link" className="text-muted p-0">
          Forgot your password?
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
