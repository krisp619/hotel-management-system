import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component
 * 
 * A flexible, reusable button component supporting multiple variants,
 * sizes, and states. Follows design system specifications.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button style: 'primary', 'secondary', 'outline', 'text'
 * @param {string} [props.size='md'] - Button size: 'sm', 'md', 'lg'
 * @param {boolean} [props.disabled=false] - Disable button
 * @param {boolean} [props.loading=false] - Show loading state
 * @param {boolean} [props.fullWidth=false] - Make button full width
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {string} [props.type='button'] - HTML button type
 * @param {string} [props.ariaLabel] - Accessibility label
 * 
 * @example
 * // Primary button
 * <Button onClick={handleClick}>Click Me</Button>
 * 
 * @example
 * // Secondary button with loading state
 * <Button variant="secondary" loading={isLoading}>Submit</Button>
 * 
 * @example
 * // Outline button, full width
 * <Button variant="outline" fullWidth>Cancel</Button>
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ariaLabel,
  ...rest
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled || loading ? styles.disabled : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner}></span>
          <span className={styles.loadingText}>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
