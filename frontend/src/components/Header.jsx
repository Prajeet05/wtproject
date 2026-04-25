import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Header({ showAdmin = false }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{
      background: '#5a4a31',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #8b6f47'
    }}>
      <h1>🅿️ Smart Parking</h1>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user && <span>{user.name || user.email}</span>}
        <button
          onClick={logout}
          style={{
            background: '#d97171',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
