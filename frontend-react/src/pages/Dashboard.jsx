import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import { slotService, bookingService } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, booked: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadData();
  }, [token, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        slotService.getSlots(bookingDate),
        bookingService.getUserBookings()
      ]);

      setSlots(slotsRes.slots || []);
      setBookings(bookingsRes.bookings || []);
      calculateStats(slotsRes.slots || []);
    } catch (error) {
      setMessage('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (slotsList) => {
    const total = slotsList.length;
    const available = slotsList.filter(s => s.status === 'available').length;
    const booked = slotsList.filter(s => s.status === 'booked').length;
    setStats({ total, available, booked });
  };

  const handleBookSlot = async (slotId) => {
    setLoading(true);
    try {
      const response = await slotService.bookSlot(slotId, bookingDate);
      if (response.success) {
        setMessage('✓ Slot booked successfully!');
        await loadData();
      } else {
        setMessage('✗ ' + response.message);
      }
    } catch (error) {
      setMessage('✗ Error booking slot: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        setMessage('✓ Booking cancelled successfully!');
        await loadData();
      } else {
        setMessage('✗ ' + response.message);
      }
    } catch (error) {
      setMessage('✗ Error cancelling booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by section
  const groupedSlots = slots.reduce((acc, slot) => {
    const section = slot.section || 'A';
    if (!acc[section]) acc[section] = [];
    acc[section].push(slot);
    return acc;
  }, {});

  return (
    <div>
      <Header showAdmin={true} />
      <div className="container">
        <main className="dashboard">
          <section className="section">
            <h2>Available <span>Parking Slots</span></h2>

            <div className="stats">
              <div className="stat-card">
                <span className="stat-label">Total Slots</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Available</span>
                <span className="stat-value">{stats.available}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Booked</span>
                <span className="stat-value">{stats.booked}</span>
              </div>
            </div>

            <div className="date-picker">
              <label htmlFor="bookingDate">Select Date:</label>
              <input
                type="date"
                id="bookingDate"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                }}
                onBlur={loadData}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {message && (
              <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            {loading && <p className="loading">Loading...</p>}

            <div id="slotsContainer">
              {Object.entries(groupedSlots).map(([section, sectionSlots]) => (
                <div key={section} className="section-group">
                  <h3>Section {section}</h3>
                  <div className="slots-grid">
                    {sectionSlots.map(slot => (
                      <div
                        key={slot._id}
                        className={`slot-card ${slot.status}`}
                        title={slot.status === 'booked' ? `Booked by ${slot.bookedBy}` : 'Available'}
                      >
                        <div className="slot-number">{slot.slotNumber}</div>
                        <div className="slot-status">{slot.status}</div>
                        {slot.status === 'available' && (
                          <button
                            className="btn btn-small btn-primary"
                            onClick={() => handleBookSlot(slot._id)}
                            disabled={loading}
                          >
                            Book
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>My <span>Bookings</span></h2>
            <div className="bookings-list">
              {bookings.length === 0 ? (
                <p className="no-data">No active bookings</p>
              ) : (
                bookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-details">
                      <strong>Slot {booking.slotNumber}</strong>
                      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      <p>Status: {booking.status}</p>
                    </div>
                    {booking.status === 'active' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
