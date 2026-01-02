import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookingAPI } from '../api';
import styles from './Bookings.module.css';

export const Bookings = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getBookings();
      setBookings(response.data.data || []);
    } catch (err) {
      setMessage('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await bookingAPI.deleteBooking(id);
        setBookings(bookings.filter((b) => b._id !== id));
        setMessage('✓ Booking deleted');
      } catch (err) {
        setMessage('✗ Failed to delete booking');
      }
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditData({ ...booking });
  };

  const handleSaveEdit = async (id) => {
    try {
      await bookingAPI.updateBooking(id, editData);
      setBookings(bookings.map((b) => (b._id === id ? editData : b)));
      setEditingId(null);
      setMessage('✓ Booking updated');
    } catch (err) {
      setMessage('✗ Failed to update booking');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>My Bookings</h2>
      {message && (
        <div
          className={`${styles.message} ${
            message.startsWith('✓') ? styles.success : styles.error
          }`}
        >
          {message}
        </div>
      )}

      {bookings.length === 0 ? (
        <p className={styles.noBookings}>No bookings yet. Start booking now!</p>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              {editingId === booking._id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <select
                    value={editData.roomType}
                    onChange={(e) =>
                      setEditData({ ...editData, roomType: e.target.value })
                    }
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                  <input
                    type="date"
                    value={editData.checkInDate?.split('T')[0]}
                    onChange={(e) =>
                      setEditData({ ...editData, checkInDate: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    value={editData.checkOutDate?.split('T')[0]}
                    onChange={(e) =>
                      setEditData({ ...editData, checkOutDate: e.target.value })
                    }
                  />
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleSaveEdit(booking._id)}
                      className={styles.saveBtn}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{booking.roomType} Room</h3>
                  <p>
                    <strong>Guest:</strong> {booking.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {booking.email}
                  </p>
                  <p>
                    <strong>Check-in:</strong>{' '}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Check-out:</strong>{' '}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleEdit(booking)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
