import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with search parameters
    navigate('/search', { state: searchData });
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Your Next Adventure
          </h1>
          <p className={styles.heroSubtitle}>
            Explore thousands of hotels, resorts, and homes worldwide
          </p>

          {/* Search Bar */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchFormGroup}>
              <label htmlFor="location">Where to?</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, hotel name, or address"
                value={searchData.location}
                onChange={handleSearchChange}
                required
              />
              <span className={styles.icon}>📍</span>
            </div>

            <div className={styles.searchFormGroup}>
              <label htmlFor="checkIn">Check-in</label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleSearchChange}
                required
              />
            </div>

            <div className={styles.searchFormGroup}>
              <label htmlFor="checkOut">Check-out</label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleSearchChange}
                required
              />
            </div>

            <div className={styles.searchFormGroup}>
              <label htmlFor="guests">Guests</label>
              <select
                id="guests"
                name="guests"
                value={searchData.guests}
                onChange={handleSearchChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>✓</div>
              <h3>500K+ Properties</h3>
              <p>Hotels, apartments, and homes in 195 countries</p>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>⭐</div>
              <h3>Genuine Reviews</h3>
              <p>Real guest reviews and verified bookings</p>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>💰</div>
              <h3>Best Price Guarantee</h3>
              <p>Price match guarantee on all bookings</p>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>🔒</div>
              <h3>Secure Booking</h3>
              <p>SSL encrypted and PCI DSS certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2>Popular Destinations</h2>
          <div className={styles.destinationGrid}>
            {[
              { name: 'Bali, Indonesia', image: '🏝️', count: '2,345 properties' },
              { name: 'Paris, France', image: '🗼', count: '1,890 properties' },
              { name: 'Tokyo, Japan', image: '🗾', count: '3,120 properties' },
              { name: 'Dubai, UAE', image: '🌆', count: '945 properties' },
              { name: 'New York, USA', image: '🗽', count: '4,560 properties' },
              { name: 'Barcelona, Spain', image: '🏛️', count: '2,100 properties' },
            ].map((dest, idx) => (
              <div key={idx} className={styles.destinationCard}>
                <div className={styles.destImage}>{dest.image}</div>
                <h3>{dest.name}</h3>
                <p>{dest.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className={styles.dealsSection}>
        <div className={styles.container}>
          <h2>Special Offers</h2>
          <div className={styles.dealGrid}>
            {[
              { label: '🎉 Early Booking', desc: 'Save up to 30% on early bookings', color: '#f97316' },
              { label: '🎁 Loyalty Rewards', desc: 'Earn points on every booking', color: '#ea580c' },
              { label: '📱 Mobile Exclusive', desc: 'App-only deals and offers', color: '#3b82f6' },
            ].map((deal, idx) => (
              <div key={idx} className={styles.dealCard} style={{ borderColor: deal.color }}>
                <h3>{deal.label}</h3>
                <p>{deal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Ready to Travel?</h2>
          <p>Start your journey today and find your perfect stay</p>
          <button 
            className={styles.ctaButton}
            onClick={() => {
              const locationInput = document.querySelector('#location');
              locationInput?.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Search Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
