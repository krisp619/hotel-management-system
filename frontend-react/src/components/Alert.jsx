/**
 * Reusable Alert Component
 * Features: success, error, warning, info variants
 */
import styles from './Alert.module.css';

export const Alert = ({ 
  message, 
  type = 'info', // success, error, warning, info
  onClose = null,
  dismissible = true,
  icon = null,
}) => {
  if (!message) return null;

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{message}</span>
      </div>
      {dismissible && onClose && (
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};
