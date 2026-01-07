import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✈️</span>
          <span className={styles.logoText}>Wanderlust</span>
        </Link>

        {/* Navigation */}
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/search" className={styles.navLink}>Search Hotels</Link>
          <Link to="/bookings" className={styles.navLink}>My Bookings</Link>
        </nav>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.btnLogin}>Log in</Link>
          <Link to="/register" className={styles.btnSignup}>Sign up</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};


export default Header;
