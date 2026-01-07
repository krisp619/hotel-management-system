import React from 'react';
import styles from './Card.module.css';

/**
 * Card Component
 * 
 * A flexible container component for grouping related content.
 * Supports multiple variants and optional header/body/footer structure.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.variant='elevated'] - Card style: 'elevated', 'outlined', 'flat'
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} [props.header] - Card header content
 * @param {React.ReactNode} [props.footer] - Card footer content
 * @param {React.ReactNode} [props.image] - Image element or URL
 * @param {boolean} [props.hoverable=false] - Add hover animation
 * @param {boolean} [props.interactive=false] - Enable interaction cursor
 * @param {string} [props.className] - Additional CSS classes
 * @param {function} [props.onClick] - Click handler
 * 
 * @example
 * // Basic card with content
 * <Card>
 *   <p>Card content here</p>
 * </Card>
 * 
 * @example
 * // Card with header and footer
 * <Card
 *   header={<h3>Title</h3>}
 *   footer={<button>Action</button>}
 *   variant="outlined"
 *   hoverable
 * >
 *   Main content
 * </Card>
 */
const Card = ({
  variant = 'elevated',
  children,
  header,
  footer,
  image,
  hoverable = false,
  interactive = false,
  className = '',
  onClick,
  ...rest
}) => {
  const cardClass = [
    styles.card,
    styles[variant],
    hoverable && styles.hoverable,
    interactive && styles.interactive,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyPress={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      } : undefined}
      {...rest}
    >
      {image && (
        <div className={styles.imageContainer}>
          {typeof image === 'string' ? (
            <img src={image} alt="card" className={styles.image} />
          ) : (
            image
          )}
        </div>
      )}
      
      {header && (
        <div className={styles.header}>
          {header}
        </div>
      )}
      
      <div className={styles.body}>
        {children}
      </div>
      
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
