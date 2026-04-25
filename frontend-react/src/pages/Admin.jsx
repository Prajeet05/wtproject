import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import { slotService, bookingService, userService } from '../services/api';
import '../styles/admin.css';

export default function Admin() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('slots-control');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [slotView, setSlotView] = useState('grid');

  useEffect(() => {
    if (!token || !user?.isAdmin) {
      navigate('/');
      return;
    }
    loadAdminData();
  }, [token, user, navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [slotsRes, bookingsRes, usersRes] = await Promise.all([
        slotService.getAllSlots(),
        bookingService.getAllBookings(),
        userService.getUsers()
      ]);

      setSlots(slotsRes.slots || []);
      setBookings(bookingsRes.bookings || []);
      setUsers(usersRes.users || []);
    } catch (error) {
      setMessage('Error loading admin data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSlots = async () => {
    setLoading(true);
    try {
      const response = await slotService.getAllSlots();
      setSlots(response.slots || []);
      setMessage('✓ Slots refreshed');
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAllSlots = async () => {
    if (!window.confirm('⚠️ Are you sure you want to reset ALL slots? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await slotService.resetAllSlots();
      if (response.success) {
        setMessage('✓ All slots have been reset');
        await loadAdminData();
      } else {
        setMessage('✗ ' + response.message);
      }
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const section = slot.section || 'A';
    if (!acc[section]) acc[section] = [];
    acc[section].push(slot);
    return acc;
  }, {});

  const stats = {
    totalSlots: slots.length,
    availableSlots: slots.filter(s => s.status === 'available').length,
    bookedSlots: slots.filter(s => s.status === 'booked').length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    totalUsers: users.length
  };

  return (
    <div>
      <Header />
      <div className="container">
        <main className="admin-dashboard">
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'slots-control' ? 'active' : ''}`}
              onClick={() => setActiveTab('slots-control')}
            >
              🅿️ Slot Control
            </button>
            <button
              className={`tab-btn ${activeTab === 'bookings-view' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings-view')}
            >
              📅 All Bookings
            </button>
            <button
              className={`tab-btn ${activeTab === 'users-management' ? 'active' : ''}`}
              onClick={() => setActiveTab('users-management')}
            >
              👥 Users
            </button>
          </div>

          {message && (
            <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* Slot Control Tab */}
          {activeTab === 'slots-control' && (
            <section className="tab-content active">
              <div className="section">
                <h2>Parking <span>Slot Management</span></h2>

                <div className="admin-actions">
                  <button className="btn btn-primary" onClick={handleRefreshSlots} disabled={loading}>
                    🔄 Refresh Slots
                  </button>
                  <button className="btn btn-danger" onClick={handleResetAllSlots} disabled={loading}>
                    ⚠️ Reset All Slots
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSlotView(slotView === 'grid' ? 'list' : 'grid')}
                  >
                    📊 Toggle View
                  </button>
                </div>

                <div className="stats">
                  <div className="stat-card">
                    <span className="stat-label">Total Slots</span>
                    <span className="stat-value">{stats.totalSlots}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Available</span>
                    <span className="stat-value">{stats.availableSlots}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Booked</span>
                    <span className="stat-value">{stats.bookedSlots}</span>
                  </div>
                </div>

                {loading && <p className="loading">Loading...</p>}

                {slotView === 'grid' ? (
                  <div className="slots-container">
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
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="slots-list">
                    <table>
                      <thead>
                        <tr>
                          <th>Slot Number</th>
                          <th>Section</th>
                          <th>Status</th>
                          <th>Booked By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map(slot => (
                          <tr key={slot._id} className={slot.status}>
                            <td>{slot.slotNumber}</td>
                            <td>{slot.section}</td>
                            <td>{slot.status}</td>
                            <td>{slot.bookedBy || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings-view' && (
            <section className="tab-content active">
              <div className="section">
                <h2>All <span>Bookings</span></h2>

                <div className="stats">
                  <div className="stat-card">
                    <span className="stat-label">Total Bookings</span>
                    <span className="stat-value">{stats.totalBookings}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Active</span>
                    <span className="stat-value">{stats.activeBookings}</span>
                  </div>
                </div>

                {loading && <p className="loading">Loading...</p>}

                <div className="bookings-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Slot Number</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Booking Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id} className={booking.status}>
                          <td>{booking.slotNumber}</td>
                          <td>{booking.userName}</td>
                          <td>{booking.userEmail}</td>
                          <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          <td>{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Users Tab */}
          {activeTab === 'users-management' && (
            <section className="tab-content active">
              <div className="section">
                <h2>User <span>Management</span></h2>

                <div className="stats">
                  <div className="stat-card">
                    <span className="stat-label">Total Users</span>
                    <span className="stat-value">{stats.totalUsers}</span>
                  </div>
                </div>

                {loading && <p className="loading">Loading...</p>}

                <div className="users-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.isAdmin ? 'Admin' : 'User'}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
