import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Header({ showAdmin = false }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <nav className="header">
      <div className="header-content">
        <h1>🅿️ Smart Parking</h1>
        <div className="header-actions">
          <div className="user-info">
            <span id="userNameDisplay">{user?.name || 'User'}</span>
            <small id="userEmailDisplay">{user?.email || 'user@email.com'}</small>
          </div>
          {showAdmin && user?.isAdmin && (
            <button className="btn btn-primary" onClick={goToAdmin}>
              👑 Admin
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
