import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/index';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Details
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validations, setValidations] = useState({
    email: false,
    password: false,
    passwordMatch: false,
    fullName: false,
    phone: false,
  });

  // Validations
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const validatePhone = (phone) => /^\d{10}$/.test(phone.replace(/[^\d]/g, ''));

  const getPasswordStrength = () => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');

    // Real-time validation
    if (name === 'email') {
      const isEmailValid = validateEmail(value);
      setValidations((prev) => ({
        ...prev,
        email: isEmailValid,
      }));
    }
    if (name === 'password') {
      setValidations((prev) => ({
        ...prev,
        password: validatePassword(value),
        passwordMatch:
          value === formData.confirmPassword && formData.confirmPassword !== '',
      }));
    }
    if (name === 'confirmPassword') {
      setValidations((prev) => ({
        ...prev,
        passwordMatch: value === formData.password && value !== '',
      }));
    }
    if (name === 'fullName') {
      setValidations((prev) => ({
        ...prev,
        fullName: value.trim().length >= 2,
      }));
    }
    if (name === 'phone') {
      setValidations((prev) => ({
        ...prev,
        phone: validatePhone(value),
      }));
    }
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!validations.email) {
      setError('Please enter a valid email address');
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();

    if (
      !validations.fullName ||
      !validations.password ||
      !validations.passwordMatch ||
      !validations.phone
    ) {
      setError('Please fill all fields correctly');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Show detailed error for debugging
      console.error('Register Error Details:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
      });
      
      // Provide specific error messages
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid registration data');
      } else if (err.response?.status === 409) {
        setError('Email already exists. Please use a different email.');
      } else if (err.message === 'Network Error' || !err.response) {
        setError('Network error. Backend may be unreachable or CORS issue.');
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      {/* Left Side - Branding */}
      <div className={styles.brandingSection}>
        <div className={styles.brandContent}>
          <h1 className={styles.brandTitle}>Join Us Today</h1>
          <p className={styles.brandSubtitle}>Start your journey with unlimited bookings</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🏆</div>
              <div>
                <div className={styles.featureTitle}>Exclusive Perks</div>
                <div className={styles.featureDescription}>Member benefits & rewards</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💰</div>
              <div>
                <div className={styles.featureTitle}>Special Offers</div>
                <div className={styles.featureDescription}>Discounts & exclusive deals</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <div>
                <div className={styles.featureTitle}>Instant Booking</div>
                <div className={styles.featureDescription}>Quick confirmation & support</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <div>
                <div className={styles.featureTitle}>Secure & Safe</div>
                <div className={styles.featureDescription}>Protected transactions</div>
              </div>
            </div>
          </div>

          <div className={styles.testimonial}>
            <p className={styles.testimonialText}>"The best travel experience I've had. Seamless bookings and amazing customer support!"</p>
            <p className={styles.testimonialAuthor}>Sarah Johnson</p>
            <p className={styles.testimonialRole}>Verified Customer</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Create Account</h2>
          <p className={styles.formSubtitle}>
            {step === 1 ? 'Step 1 of 2 - Email Verification' : 'Step 2 of 2 - Complete Your Profile'}
          </p>

          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={step === 1 ? handleStep1 : handleStep2}>
            {step === 1 ? (
              // Step 1: Email
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
            ) : (
              // Step 2: Details
              <>
                {/* Full Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>
                    Full Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        validations.fullName && formData.fullName
                          ? styles.inputSuccess
                          : ''
                      }`}
                      required
                    />
                    {validations.fullName && formData.fullName && (
                      <span className={styles.validationIcon}>✓</span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="1234567890"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        validations.phone && formData.phone ? styles.inputSuccess : ''
                      }`}
                      required
                    />
                    {validations.phone && formData.phone && (
                      <span className={styles.validationIcon}>✓</span>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        validations.password && formData.password
                          ? styles.inputSuccess
                          : ''
                      }`}
                      required
                    />
                    {validations.password && formData.password && (
                      <span className={styles.validationIcon}>✓</span>
                    )}
                  </div>

                  {/* Password Strength */}
                  {formData.password && (
                    <div className={styles.strengthMeter}>
                      <div
                        className={`${styles.strengthBar} ${styles[
                          'strength-' + getPasswordStrength().toLowerCase()
                        ]}`}
                      ></div>
                      <span className={styles.strengthText}>{getPasswordStrength()}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Confirm Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        validations.passwordMatch && formData.confirmPassword
                          ? styles.inputSuccess
                          : ''
                      }`}
                      required
                    />
                    {validations.passwordMatch && formData.confirmPassword && (
                      <span className={styles.validationIcon}>✓</span>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className={styles.termsCheckbox}>
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the{' '}
                    <a href="/terms" className={styles.link}>
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className={styles.link}>
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={styles.backButton}
                >
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={
                  loading ||
                  (step === 1 && !validations.email) ||
                  (step === 2 &&
                    (!validations.fullName ||
                      !validations.password ||
                      !validations.passwordMatch ||
                      !validations.phone))
                }
                className={styles.submitButton}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    {step === 1 ? 'Verifying...' : 'Creating Account...'}
                  </>
                ) : step === 1 ? (
                  'Continue →'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <p className={styles.signinText}>
            Already have an account?{' '}
            <a href="/login" className={styles.signinLink}>
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
