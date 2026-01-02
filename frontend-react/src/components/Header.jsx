import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
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
        <h1>🏨 Hotel Management</h1>
        <nav className={styles.nav}>
          {isAuthenticated() ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/bookings">My Bookings</Link>
              <span className={styles.user}>Welcome, {user?.name}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
