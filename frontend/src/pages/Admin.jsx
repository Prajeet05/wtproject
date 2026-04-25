import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import { slotService, bookingService } from '../services/api';
import '../styles/admin.css';

export default function Admin() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, booked: 0, available: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch slots
      const slotsResponse = await slotService.getAllSlots();
      const slots_data = slotsResponse.slots || slotsResponse;
      
      const mappedSlots = slots_data.map(slot => ({
        _id: slot._id,
        slotNumber: slot.slotNumber,
        section: slot.section,
        isBooked: slot.isBooked,
        createdAt: slot.createdAt
      }));
      
      setSlots(mappedSlots);

      // Calculate stats
      const total = mappedSlots.length;
      const booked = mappedSlots.filter(s => s.isBooked).length;
      setStats({ total, booked, available: total - booked });

      // Fetch bookings
      try {
        const bookingsResponse = await bookingService.getAllBookings();
        setBookings(bookingsResponse.bookings || bookingsResponse || []);
      } catch (e) {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAllSlots = async () => {
    if (!window.confirm('⚠️ This will reset ALL slots to available status. Continue?')) return;

    try {
      // Delete all bookings first
      for (let booking of bookings) {
        try {
          await bookingService.cancelBooking(booking._id);
        } catch (e) {
          console.log('Booking already cancelled');
        }
      }

      // Reset slots
      await slotService.resetAllSlots();
      
      setMessageType('success');
      setMessage('✓ All slots reset successfully!');
      setTimeout(() => {
        setMessage('');
        fetchData();
      }, 2000);
    } catch (error) {
      console.error('Error resetting slots:', error);
      setMessageType('error');
      setMessage('✗ Failed to reset slots');
      setTimeout(() => setMessage(''), 3000);
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

  // Group slots by section
  const slotsBySection = {};
  slots.forEach(slot => {
    if (!slotsBySection[slot.section]) {
      slotsBySection[slot.section] = [];
    }
    slotsBySection[slot.section].push(slot);
  });

  return (
    <>
      <Header showAdmin={true} />
      <div className="admin-container">
        <div className="admin-content">
          <div className="admin-header">
            <h1>🔧 Admin Dashboard</h1>
            <div className="admin-actions">
              <button className="btn reset-btn" onClick={resetAllSlots}>
                🔄 Reset All Slots
              </button>
              <button className="btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
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

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #8b6f47'
            }}>
              <p style={{ color: '#7a7a7a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Total Slots
              </p>
              <h2 style={{ color: '#8b6f47', fontSize: '2rem', margin: 0 }}>
                {stats.total}
              </h2>
            </div>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #8fa881'
            }}>
              <p style={{ color: '#7a7a7a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Available
              </p>
              <h2 style={{ color: '#8fa881', fontSize: '2rem', margin: 0 }}>
                {stats.available}
              </h2>
            </div>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #d97171'
            }}>
              <p style={{ color: '#7a7a7a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Booked
              </p>
              <h2 style={{ color: '#d97171', fontSize: '2rem', margin: 0 }}>
                {stats.booked}
              </h2>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #e0d9ce' }}>
            {['overview', 'slots', 'bookings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: activeTab === tab ? '#8b6f47' : 'transparent',
                  color: activeTab === tab ? 'white' : '#7a7a7a',
                  border: activeTab === tab ? '2px solid #8b6f47' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div>
                  <h3 style={{ color: '#5a4a31', marginBottom: '1.5rem' }}>Parking Map</h3>
                  <div style={{ display: 'grid', gap: '2rem' }}>
                    {Object.entries(slotsBySection).map(([section, sectionSlots]) => (
                      <div key={section}>
                        <h4 style={{ color: '#8b6f47', marginBottom: '1rem' }}>Section {section}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                          {sectionSlots.map(slot => (
                            <div
                              key={slot._id}
                              style={{
                                padding: '1rem',
                                background: slot.isBooked ? '#ead5d5' : '#d4e5cc',
                                border: `2px solid ${slot.isBooked ? '#d97171' : '#8fa881'}`,
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'default'
                              }}
                            >
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                {slot.isBooked ? '🔴' : '🟢'}
                              </div>
                              <p style={{ margin: 0, fontWeight: '600', color: slot.isBooked ? '#d97171' : '#8fa881' }}>
                                {slot.slotNumber}
                              </p>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: '#7a7a7a' }}>
                                {slot.isBooked ? 'Booked' : 'Free'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'slots' && (
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Slot Number</th>
                        <th>Section</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot) => (
                        <tr key={slot._id}>
                          <td style={{ fontWeight: '600' }}>{slot.slotNumber}</td>
                          <td>{slot.section}</td>
                          <td>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              background: slot.isBooked ? '#ead5d5' : '#d4e5cc',
                              color: slot.isBooked ? '#d97171' : '#8fa881',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {slot.isBooked ? '🔴 Booked' : '🟢 Available'}
                            </span>
                          </td>
                          <td>{new Date(slot.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Slot</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', color: '#7a7a7a' }}>
                            No bookings yet
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td style={{ fontWeight: '600' }}>
                              {booking.slotNumber || booking.slotId?.slotNumber || 'N/A'}
                            </td>
                            <td>{booking.userId?.name || booking.userId?.email || 'Unknown'}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>{booking.bookingTime}</td>
                            <td>{booking.duration}h</td>
                            <td>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                background: booking.status === 'active' ? '#d4e5cc' : '#ead5d5',
                                color: booking.status === 'active' ? '#8fa881' : '#d97171',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}>
                                {booking.status}
                              </span>
                            </td>
                            <td>
                              {booking.status === 'active' && (
                                <button
                                  onClick={() => cancelBooking(booking._id)}
                                  style={{
                                    background: '#d97171',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s'
                                  }}
                                  onMouseOver={(e) => e.target.style.background = '#c85a5a'}
                                  onMouseOut={(e) => e.target.style.background = '#d97171'}
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
