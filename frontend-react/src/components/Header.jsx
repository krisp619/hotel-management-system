import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './Button';
import styles from './Header.module.css';

export const Header = () => {
  const { isAuthenticated, getUser, logout } = useAuth();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏨</span>
          <span className={styles.logoText}>Hotel Manager</span>
        </Link>
        
        <nav className={styles.nav}>
          {isAuthenticated() ? (
            <>
              <Link to="/" className={styles.navLink}>Dashboard</Link>
              <Link to="/bookings" className={styles.navLink}>My Bookings</Link>
              <div className={styles.userSection}>
                <span className={styles.userName}>👤 {user?.name}</span>
                <Button 
                  onClick={handleLogout} 
                  variant="secondary"
                  className={styles.logoutBtn}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Button 
                onClick={() => navigate('/register')} 
                variant="secondary"
                className={styles.signupBtn}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
