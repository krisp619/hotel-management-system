/**
 * Reusable Input Component
 * Features: validation states, error messages, icons
 */
import styles from './Input.module.css';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error = '',
  required = false,
  disabled = false,
  autoComplete = 'off',
  ...props
}) => {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
