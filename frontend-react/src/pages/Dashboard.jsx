import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookingAPI } from '../api';
import styles from './Dashboard.module.css';

const ROOM_TYPES = [
  { name: 'Single', price: '$50/night', description: '1 bed, private bathroom' },
  { name: 'Double', price: '$100/night', description: '2 beds, private bathroom' },
  { name: 'Deluxe', price: '$200/night', description: 'King bed, jacuzzi, room service' },
];

export const Dashboard = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const bookingData = {
        ...formData,
        roomType: selectedRoom, // Add roomType here!
      };
      await bookingAPI.createBooking(bookingData);
      setMessage('✓ Booking created successfully!');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        roomType: '',
        checkInDate: '',
        checkOutDate: '',
      });
      setSelectedRoom(null);
    } catch (err) {
      setMessage('✗ ' + (err.response?.data?.error || 'Booking failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Welcome, {user?.name}!</h2>
      <p className={styles.subtitle}>Browse and book your favorite room</p>

      <div className={styles.roomsGrid}>
        {ROOM_TYPES.map((room) => (
          <div
            key={room.name}
            className={`${styles.roomCard} ${
              selectedRoom === room.name ? styles.selected : ''
            }`}
            onClick={() => setSelectedRoom(room.name)}
          >
            <h3>{room.name}</h3>
            <p className={styles.price}>{room.price}</p>
            <p>{room.description}</p>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className={styles.bookingForm}>
          <h3>Book {selectedRoom} Room</h3>
          {message && (
            <div
              className={`${styles.message} ${
                message.startsWith('✓') ? styles.success : styles.error
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Guest Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
