import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/index';
import styles from './Login.module.css';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({ email: false, password: false });

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');

    if (name === 'email') {
      setValidations((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }

    if (name === 'password') {
      setValidations((prev) => ({
        ...prev,
        password: value.length >= 6,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email) || formData.password.length < 6) {
      setError('Please enter valid credentials');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Show detailed error for debugging
      console.error('Login Error Details:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
      });
      
      // Provide specific error messages
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. Please try again.');
      } else if (err.message === 'Network Error' || !err.response) {
        setError('Network error. Backend may be unreachable or CORS issue.');
      } else {
        setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Side - Branding */}
      <div className={styles.brandingSection}>
        <div className={styles.brandContent}>
          <h1 className={styles.brandTitle}>Hotel Management</h1>
          <p className={styles.brandSubtitle}>Your journey to perfect stays</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>Secure booking process</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>Best price guarantee</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>24/7 customer support</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>Exclusive member deals</span>
            </div>
          </div>

          <div className={styles.testimonial}>
            <p className={styles.testimonialText}>
              "Amazing experience! Booked my dream vacation in minutes."
            </p>
            <p className={styles.testimonialAuthor}>- Sarah M., Verified Traveler</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Welcome Back</h2>
          <p className={styles.formSubtitle}>Sign in to your account</p>

          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${
                    error && !validations.email ? styles.inputError : ''
                  } ${validations.email && formData.email ? styles.inputSuccess : ''}`}
                  required
                />
                {validations.email && formData.email && (
                  <span className={styles.validationIcon}>✓</span>
                )}
              </div>
              {error && !validations.email && formData.email && (
                <span className={styles.errorText}>Invalid email format</span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${
                    error && !validations.password ? styles.inputError : ''
                  } ${validations.password && formData.password ? styles.inputSuccess : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleButton}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {error && !validations.password && formData.password && (
                <span className={styles.errorText}>Password must be at least 6 characters</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={styles.bottomLinks}>
              <label className={styles.rememberLabel}>
                <input type="checkbox" className={styles.checkbox} />
                Remember me
              </label>
              <a href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !validations.email || !validations.password}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          {/* Social Login */}
          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialBtn} aria-label="Login with Google">
              <span>G</span> Google
            </button>
            <button type="button" className={styles.socialBtn} aria-label="Login with Facebook">
              <span>f</span> Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <p className={styles.signupText}>
            Don't have an account?{' '}
            <a href="/register" className={styles.signupLink}>
              Create one now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
