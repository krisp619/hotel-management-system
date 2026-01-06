import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import styles from './Login.module.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
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
      const payload = { email, password };
      const response = await authAPI.login(payload);
      
      setSuccess('✓ Login successful! Redirecting...');
      login(response.data.token, response.data.user);
      
      // Redirect after short delay to show success message
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <Card
          title="Welcome Back"
          subtitle="Sign in to your hotel booking account"
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
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="you@example.com"
              error={errors.email}
              required
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
            />
            
            <div className={styles.forgotPassword}>
              <Link to="#" title="Password reset coming soon">
                Forgot your password?
              </Link>
            </div>
            
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className={styles.divider}></div>
          
          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>
              Create one now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
