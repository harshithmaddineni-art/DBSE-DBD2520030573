import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both admin email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password, 'admin');
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Admin login failed.');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⚙️</div>
          <h2>Admin Portal Sign In</h2>
          <p className="auth-subtitle">Institutional System Administrator Access</p>
        </div>

        {/* Role Portal Switch Tabs */}
        <div className="login-portal-tabs">
          <Link to="/login" className="portal-tab">
            🎓 Student
          </Link>
          <Link to="/staff/login" className="portal-tab">
            👨‍🏫 Staff
          </Link>
          <Link to="/admin/login" className="portal-tab active">
            ⚙️ Admin
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="adminEmail">Administrator Email</label>
            <input
              type="email"
              id="adminEmail"
              className="form-control"
              placeholder="e.g. admin@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Authenticating Admin...' : 'Admin Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Looking for <Link to="/login">Student Sign In</Link> or{' '}
            <Link to="/staff/login">Staff Sign In</Link>?
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
