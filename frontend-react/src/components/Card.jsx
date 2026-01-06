/**
 * Reusable Card Component
 * Features: consistent styling for content containers
 */
import styles from './Card.module.css';

export const Card = ({ 
  children, 
  title = null, 
  subtitle = null,
  className = '' 
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
