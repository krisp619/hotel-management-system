import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import styles from './Register.module.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    
    // Validate
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      // Only send name, email, password (NOT confirmPassword)
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await authAPI.register(payload);
      setSuccess('✓ Account created successfully! Redirecting...');
      
      login(response.data.token, response.data.user);
      
      // Redirect after short delay to show success message
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <Card
          title="Create Account"
          subtitle="Join us and start booking your rooms"
          className={styles.formCard}
        >
          {success && (
            <Alert 
              message={success} 
              type="success" 
              icon="✓"
              dismissible={false}
            />
          )}
          
          {apiError && (
            <Alert 
              message={apiError} 
              type="error" 
              icon="✕"
              onClose={() => setApiError('')}
              dismissible={true}
            />
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="John Doe"
              error={errors.name}
              required
              autoComplete="name"
            />
            
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              error={errors.email}
              required
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Create a strong password"
              error={errors.password}
              required
              autoComplete="new-password"
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />
            
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className={styles.divider}></div>
          
          <p className={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
