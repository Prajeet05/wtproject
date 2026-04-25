import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import { slotService, bookingService } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('09:00');
  const [duration, setDuration] = useState('1');
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const slotsResponse = await slotService.getAllSlots();
      const slots_data = slotsResponse.slots || slotsResponse;
      
      // Map backend response to match frontend expectations
      const mappedSlots = slots_data.map(slot => ({
        _id: slot._id,
        slotNumber: slot.slotNumber,
        status: slot.isBooked ? 'booked' : 'available',
        isBooked: slot.isBooked
      }));
      
      setSlots(mappedSlots);

      // Fetch user bookings
      try {
        const bookingsResponse = await bookingService.getUserBookings();
        setUserBookings(bookingsResponse.bookings || bookingsResponse || []);
      } catch (e) {
        setUserBookings([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const submitBooking = async () => {
    if (!selectedSlot || !bookingDate || !bookingTime) {
      setMessageType('error');
      setMessage('✗ Please fill in all fields');
      return;
    }

    try {
      const response = await bookingService.bookSlot({
        slotId: selectedSlot._id,
        bookingDate,
        bookingTime,
        duration: parseInt(duration)
      });

      setMessageType('success');
      setMessage('✓ Slot booked successfully!');
      setShowBookingForm(false);
      
      setTimeout(() => {
        setMessage('');
        fetchData();
      }, 2000);
    } catch (error) {
      console.error('Error booking slot:', error);
      setMessageType('error');
      setMessage('✗ ' + (error.message || 'Failed to book slot'));
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      setMessageType('success');
      setMessage('✓ Booking cancelled');
      setTimeout(() => {
        setMessage('');
        fetchData();
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage('✗ Failed to cancel booking');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const availableSlots = slots.filter(s => !s.isBooked).length;

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>🅿️ Parking Slot Booking</h1>
              <p style={{ color: '#7a7a7a', marginTop: '0.5rem' }}>
                Available Slots: <strong>{availableSlots} / {slots.length}</strong>
              </p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {message && (
            <div style={{
              padding: '1rem',
              margin: '1rem 0',
              borderRadius: '8px',
              background: messageType === 'success' ? '#d4e5cc' : '#ead5d5',
              color: messageType === 'success' ? '#8fa881' : '#d97171',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {message}
            </div>
          )}

          {/* Active Bookings Section */}
          {userBookings && userBookings.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#5a4a31', marginBottom: '1rem' }}>My Active Bookings</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {userBookings.map((booking) => (
                  <div key={booking._id} style={{
                    background: 'white',
                    border: '2px solid #8fa881',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ color: '#8fa881', marginBottom: '0.5rem' }}>
                          📍 {booking.slotNumber || booking.slotId?.slotNumber}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#7a7a7a', marginBottom: '0.3rem' }}>
                          <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#7a7a7a', marginBottom: '0.3rem' }}>
                          <strong>Time:</strong> {booking.bookingTime}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#7a7a7a' }}>
                          <strong>Duration:</strong> {booking.duration} hour(s)
                        </p>
                      </div>
                      <span style={{
                        background: '#d4e5cc',
                        color: '#8fa881',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      style={{
                        background: '#d97171',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        marginTop: '1rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        width: '100%',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#c85a5a'}
                      onMouseOut={(e) => e.target.style.background = '#d97171'}
                    >
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Slots Section */}
          <div>
            <h2 style={{ color: '#5a4a31', marginBottom: '1rem' }}>Available Parking Slots</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>No slots available</p>
              </div>
            ) : (
              <div className="slots-grid">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`slot-card ${slot.isBooked ? 'booked' : 'available'}`}
                    style={{
                      background: slot.isBooked ? '#fff5f5' : '#f5fffb',
                      borderColor: slot.isBooked ? '#d97171' : '#8fa881',
                      opacity: slot.isBooked ? 0.6 : 1,
                      transition: 'all 0.3s'
                    }}
                  >
                    <div className="slot-status">
                      {slot.isBooked ? '🔴' : '🟢'}
                    </div>
                    <h3 style={{ color: slot.isBooked ? '#d97171' : '#8fa881' }}>
                      {slot.slotNumber}
                    </h3>
                    <p style={{ marginBottom: '1rem', color: '#7a7a7a', fontSize: '0.9rem' }}>
                      {slot.isBooked ? 'Booked' : 'Available'}
                    </p>
                    {!slot.isBooked && (
                      <button
                        className="book-btn"
                        onClick={() => handleBookSlot(slot)}
                        style={{
                          background: '#8fa881',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          width: '100%',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#7a9370'}
                        onMouseOut={(e) => e.target.style.background = '#8fa881'}
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && selectedSlot && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ color: '#5a4a31', marginBottom: '1.5rem' }}>
                Book Slot {selectedSlot.slotNumber}
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#5a4a31' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d9d3c8',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#5a4a31' }}>
                  Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d9d3c8',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#5a4a31' }}>
                  Duration (hours)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d9d3c8',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem'
                  }}
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="8">Full Day (8 Hours)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowBookingForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#e8e0d5',
                    color: '#5a4a31',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.target.background = '#ddd5ca'}
                  onMouseOut={(e) => e.target.background = '#e8e0d5'}
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#8b6f47',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.target.background = '#5a4a31'}
                  onMouseOut={(e) => e.target.background = '#8b6f47'}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
