import React, { useState } from 'react';
import styles from './Input.module.css';

/**
 * Input Component
 * 
 * A flexible, reusable input field with support for various states,
 * icons, and validation feedback. Follows design system specifications.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type: 'text', 'email', 'password', 'number', etc.
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} [props.label] - Label text
 * @param {string} [props.error] - Error message
 * @param {string} [props.success] - Success message
 * @param {string} [props.hint] - Helper hint text
 * @param {boolean} [props.disabled=false] - Disable input
 * @param {boolean} [props.required=false] - Mark as required
 * @param {React.ReactNode} [props.icon] - Icon component or element
 * @param {React.ReactNode} [props.suffix] - Suffix element
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.id] - Input ID
 * @param {string} [props.name] - Input name
 * 
 * @example
 * // Basic input
 * <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
 * 
 * @example
 * // Input with validation
 * <Input
 *   type="email"
 *   label="Email"
 *   placeholder="you@example.com"
 *   value={email}
 *   error={emailError}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 */
const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  icon,
  suffix,
  className = '',
  id,
  name,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || name || `input-${Math.random()}`;
  
  let inputType = type;
  if (type === 'password' && showPassword) {
    inputType = 'text';
  }

  const containerClass = [
    styles.container,
    error && styles.errorContainer,
    success && styles.successContainer,
    className
  ]
    .filter(Boolean)
    .join(' ');

  const inputClass = [
    styles.input,
    error && styles.error,
    success && styles.success,
    icon && styles.withIcon,
    suffix && styles.withSuffix,
    disabled && styles.disabled
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        
        <input
          id={inputId}
          type={inputType}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
        
        {success && <span className={styles.successIcon}>✓</span>}
        
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>

      {error && (
        <span className={styles.errorMessage} id={`${inputId}-error`} role="alert">
          {error}
        </span>
      )}
      
      {success && (
        <span className={styles.successMessage} id={`${inputId}-success`}>
          {success}
        </span>
      )}
      
      {hint && !error && (
        <span className={styles.hint} id={`${inputId}-hint`}>
          {hint}
        </span>
      )}
    </div>
  );
};

export default Input;
