import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onToggleSidebar, onOpenFaq }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <Link to="/" className="portal-brand">
          <div className="portal-logo">🏛️</div>
          <div className="portal-title-wrapper">
            <span className="portal-title">Grievance Redressal Portal</span>
            <span className="portal-subtitle">Institutional Management System</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button onClick={onOpenFaq} className="nav-faq-btn">
          FAQ
        </button>

        {user ? (
          <div className="user-profile-menu">
            <div className="user-details">
              <span className="user-name">{user.name || 'User'}</span>
              <span className={`user-role-tag role-${user.role}`}>
                {user.role?.toUpperCase()}
              </span>
            </div>

            <button onClick={handleLogout} className="btn-logout" title="Logout">
              Logout 🚪
            </button>
          </div>
        ) : (
          <div className="auth-nav-links">
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
