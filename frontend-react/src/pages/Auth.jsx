import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { authService } from '../services/api';
import '../styles/auth.css';

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLoginMode) {
        // Login
        const response = await authService.login(
          formData.email,
          formData.password
        );

        if (response.success) {
          login(response.user, response.token);
          setMessageType('success');
          setMessage('✓ Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setMessageType('error');
          setMessage('✗ ' + response.message);
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setMessageType('error');
          setMessage('✗ Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await authService.register(
          formData.name,
          formData.email,
          formData.password
        );

        if (response.success) {
          setMessageType('success');
          setMessage('✓ Registration successful! Logging in...');
          login(response.user, response.token);
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setMessageType('error');
          setMessage('✗ ' + response.message);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessageType('error');
      setMessage('✗ ' + (error.message || 'Connection error. Make sure the server is running.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section active">
      <div className="auth-card">
        <h1>🅿️ Smart Parking</h1>
        <p className="subtitle">{isLoginMode ? 'Login to your account' : 'Create your account'}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
          </button>
        </form>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <p className="auth-switch">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setIsLoginMode(!isLoginMode);
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            setMessage('');
          }}>
            {isLoginMode ? 'Register here' : 'Login here'}
          </a>
        </p>
      </div>
    </div>
  );
}
