/**
 * Reusable Button Component
 * Features: loading state, disabled state, variants
 */
import styles from './Button.module.css';

export const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary', // primary, secondary, danger
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
    >
      {loading ? (
        <>
          <span className={styles.spinner}></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
