# 📱 Page-by-Page Redesign Code Examples

## Dashboard Page - Complete Redesign

### Current vs. New Architecture

**BEFORE** (Basic):
```
- Simple grid of 3 room cards
- Basic booking form below
- No filtering or search
- No visual feedback
```

**AFTER** (Premium):
```
- Hero section with search bar
- Featured deals carousel
- Advanced filter sidebar
- Premium room card grid
- Modal booking form
- Success/error notifications
```

### New Dashboard.jsx Structure

```jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookingAPI } from '../api';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Card } from '../components/shared/Card';
import { SearchHero } from '../components/features/SearchHero';
import { RoomCard } from '../components/features/RoomCard';
import { BookingModal } from '../components/features/BookingModal';
import { FilterSidebar } from '../components/features/FilterSidebar';
import styles from './Dashboard.module.css';

const ROOMS = [
  {
    id: 1,
    name: 'Single Room',
    price: 50,
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
    amenities: ['WiFi', 'AC', 'TV', 'Bathroom'],
    description: 'Cozy single room perfect for solo travelers',
    availability: true,
  },
  {
    id: 2,
    name: 'Double Room',
    price: 100,
    rating: 4.7,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1618883182384-a83a8e7b9b47',
    amenities: ['WiFi', 'AC', 'TV', 'Bathroom', 'Minibar'],
    description: 'Comfortable double room for couples',
    availability: true,
  },
  {
    id: 3,
    name: 'Deluxe Suite',
    price: 200,
    rating: 4.9,
    reviews: 389,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267',
    amenities: ['WiFi', 'AC', 'TV', 'Bathroom', 'Jacuzzi', 'Lounge'],
    description: 'Premium deluxe suite with luxury amenities',
    availability: true,
    badge: '⭐ Premium',
  },
];

export const Dashboard = () => {
  const { getUser } = useAuth();
  const user = getUser();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 500,
    rating: 0,
    amenities: [],
  });

  const filteredRooms = ROOMS.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = room.price >= filters.priceMin && room.price <= filters.priceMax;
    const matchesRating = room.rating >= filters.rating;
    const matchesAmenities = filters.amenities.length === 0 || 
      filters.amenities.some(amenity => room.amenities.includes(amenity));
    
    return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
  });

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleBooking = async (bookingData) => {
    setLoading(true);
    try {
      await bookingAPI.createBooking({
        ...bookingData,
        roomType: selectedRoom.name,
      });
      setMessage('✓ Booking created successfully!');
      setShowModal(false);
      setSelectedRoom(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ ' + (error.response?.data?.error || 'Booking failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Success/Error Message */}
      {message && (
        <div className={`${styles.notification} ${message.startsWith('✓') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      {/* Hero Section with Search */}
      <SearchHero 
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={() => {}}
      />

      {/* Main Content */}
      <div className={styles.content}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <FilterSidebar 
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        {/* Main Content Area */}
        <main className={styles.main}>
          {/* Results Header */}
          <div className={styles['results-header']}>
            <h2>{filteredRooms.length} rooms available</h2>
            <select className={styles['sort-select']}>
              <option>Most Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
            </select>
          </div>

          {/* Room Grid */}
          {filteredRooms.length > 0 ? (
            <div className={styles['room-grid']}>
              {filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onBook={() => handleRoomSelect(room)}
                />
              ))}
            </div>
          ) : (
            <div className={styles['empty-state']}>
              <p>No rooms match your filters</p>
              <Button 
                variant="secondary"
                onClick={() => setFilters({
                  priceMin: 0,
                  priceMax: 500,
                  rating: 0,
                  amenities: [],
                })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {showModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          user={user}
          onClose={() => setShowModal(false)}
          onSubmit={handleBooking}
          loading={loading}
        />
      )}
    </div>
  );
};
```

### New Dashboard.module.css

```css
.container {
  flex: 1;
  background: var(--color-neutral-light);
}

.notification {
  position: fixed;
  top: 100px;
  right: var(--space-6);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  animation: slideInRight 0.3s ease-out;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
}

.notification.success {
  background: var(--color-success);
  color: white;
}

.notification.error {
  background: var(--color-error);
  color: white;
}

.content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-8);
  padding: var(--space-8);
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.main {
  flex: 1;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
  gap: var(--space-4);
}

.results-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.sort-select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-neutral-border);
  border-radius: var(--radius-md);
  background: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.sort-select:hover,
.sort-select:focus {
  border-color: var(--color-primary-500);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-50);
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
  animation: fadeIn 0.3s ease-out;
}

.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: white;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-neutral-border);
}

.empty-state p {
  color: var(--color-neutral-medium);
  margin-bottom: var(--space-6);
}

/* Responsive */
@media (max-width: 1024px) {
  .content {
    grid-template-columns: 250px 1fr;
    gap: var(--space-6);
  }

  .room-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  .sidebar {
    position: static;
    order: 2;
  }

  .main {
    order: 1;
  }

  .room-grid {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .sort-select {
    width: 100%;
  }
}
```

---

## New Feature Components

### SearchHero Component

```jsx
// src/components/features/SearchHero.jsx
import styles from './SearchHero.module.css';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';

export const SearchHero = ({ value, onChange, onSearch }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}></div>
      
      <div className={styles.content}>
        <h1>Find Your Perfect Stay</h1>
        <p>Discover amazing rooms and create unforgettable memories</p>
        
        <div className={styles['search-bar']}>
          <Input
            type="text"
            placeholder="Search hotels, rooms, or destinations..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            icon="🔍"
            size="lg"
          />
          <Button 
            variant="primary"
            size="lg"
            onClick={onSearch}
            icon="→"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
```

```css
/* SearchHero.module.css */
.hero {
  position: relative;
  background: linear-gradient(135deg, #1F5AC8 0%, #6F42C1 100%);
  color: white;
  padding: var(--space-12) var(--space-8);
  text-align: center;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.overlay {
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.05)"/></svg>');
  background-size: cover;
}

.content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.content h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
  color: white;
}

.content p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-8);
}

.search-bar {
  display: flex;
  gap: var(--space-2);
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-8) var(--space-4);
  }

  .content h1 {
    font-size: 1.75rem;
  }

  .search-bar {
    flex-direction: column;
  }
}
```

### RoomCard Component

```jsx
// src/components/features/RoomCard.jsx
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import styles from './RoomCard.module.css';

export const RoomCard = ({ room, onBook }) => {
  return (
    <Card 
      variant="elevated"
      padding="md"
      image={room.image}
      badge={room.badge && <Badge status="warning">{room.badge}</Badge>}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{room.name}</h3>
          <div className={styles.rating}>
            <span className={styles.stars}>⭐ {room.rating}</span>
            <span className={styles.reviews}>({room.reviews})</span>
          </div>
        </div>

        <p className={styles.description}>{room.description}</p>

        <div className={styles.amenities}>
          {room.amenities.map(amenity => (
            <Badge key={amenity} size="sm">{amenity}</Badge>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles['price-amount']}>${room.price}</span>
            <span className={styles['price-unit']}>/night</span>
          </div>
          <Button 
            variant="primary"
            size="sm"
            onClick={onBook}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};
```

```css
/* RoomCard.module.css */
.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
}

.title {
  margin: 0;
  font-size: 1.25rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
}

.stars {
  font-weight: var(--font-weight-bold);
  color: #FF6B35;
}

.reviews {
  color: var(--color-neutral-medium);
  font-size: 0.875rem;
}

.description {
  margin: 0;
  color: var(--color-neutral-dark);
  font-size: 0.95rem;
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-neutral-border);
  margin-top: var(--space-4);
}

.price {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.price-amount {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

.price-unit {
  color: var(--color-neutral-medium);
  font-size: 0.875rem;
}
```

---

## Bookings Page - Timeline View

```jsx
// src/pages/dashboard/Bookings.jsx
import { useState, useEffect } from 'react';
import { bookingAPI } from '../../api';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import styles from './Bookings.module.css';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingAPI.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (checkOut < now) return 'completed';
    if (checkIn <= now && checkOut > now) return 'ongoing';
    return 'confirmed';
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'info',
      ongoing: 'warning',
      completed: 'success',
    };
    return colors[status] || 'default';
  };

  const filteredBookings = bookings.filter(booking => {
    const status = getStatus(booking);
    return activeTab === 'upcoming' 
      ? ['confirmed', 'ongoing'].includes(status)
      : status === 'completed';
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Bookings</h1>
        <p>View and manage all your hotel reservations</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({bookings.filter(b => {
            const s = getStatus(b);
            return ['confirmed', 'ongoing'].includes(s);
          }).length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'past' ? styles.active : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past ({bookings.filter(b => getStatus(b) === 'completed').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className={styles['bookings-list']}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <Card key={booking._id} variant="outlined" padding="lg">
              <div className={styles['booking-card']}>
                <div className={styles['booking-header']}>
                  <div>
                    <h3>{booking.roomType} Room</h3>
                    <p className={styles['booking-id']}>ID: {booking._id.slice(-8)}</p>
                  </div>
                  <Badge status={getStatusColor(getStatus(booking))}>
                    {getStatus(booking).toUpperCase()}
                  </Badge>
                </div>

                <div className={styles['booking-details']}>
                  <div className={styles['detail-item']}>
                    <span className={styles.label}>Guest:</span>
                    <span>{booking.name}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span className={styles.label}>Check-in:</span>
                    <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span className={styles.label}>Check-out:</span>
                    <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span className={styles.label}>Nights:</span>
                    <span>{Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))}</span>
                  </div>
                </div>

                <div className={styles['booking-actions']}>
                  <Button variant="secondary" size="sm">Modify</Button>
                  <Button variant="tertiary" size="sm">Cancel</Button>
                  {getStatus(booking) === 'completed' && (
                    <Button variant="primary" size="sm">Leave Review</Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className={styles['empty-state']}>
            <p>{activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

**Next Steps:**
1. Create folder structure
2. Move components to new locations
3. Update imports across project
4. Test each component
5. Deploy to production

**Estimated Time**: 2-3 weeks for full implementation
