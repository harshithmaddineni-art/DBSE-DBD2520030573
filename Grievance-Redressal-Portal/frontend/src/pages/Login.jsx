import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
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
      setError('Please fill in both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password, 'student');
      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Login failed.');
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
          <div className="auth-logo">🎓</div>
          <h2>Student Portal Sign In</h2>
          <p className="auth-subtitle">Grievance Redressal Portal for Institutions</p>
        </div>

        {/* Role Portal Switch Tabs */}
        <div className="login-portal-tabs">
          <Link to="/login" className="portal-tab active">
            🎓 Student
          </Link>
          <Link to="/staff/login" className="portal-tab">
            👨‍🏫 Staff
          </Link>
          <Link to="/admin/login" className="portal-tab">
            ⚙️ Admin
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Student Institutional Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="e.g. student@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Student Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have a student account? <Link to="/signup">Sign Up</Link>
          </p>
          <p className="mt-2 text-xs">
            Staff Sign In: <Link to="/staff/login">Staff Portal</Link> | Admin Sign In:{' '}
            <Link to="/admin/login">Admin Portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
