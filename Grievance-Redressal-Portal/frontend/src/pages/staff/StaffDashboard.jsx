import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import grievanceService from '../../services/grievanceService';
import GrievanceCard from '../../components/GrievanceCard';
import Loading from '../../components/Loading';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');



  const fetchStaffGrievances = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await grievanceService.getGrievances().catch(() => null);
      if (Array.isArray(data)) {
        setGrievances(data);
      } else {
        setGrievances([]);
      }
    } catch (err) {
      console.error('Error fetching staff grievances:', err);
      setError('Unable to load assigned grievances from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffGrievances();
  }, [user]);

  const assignedCount = grievances.length;
  const pendingCount = grievances.filter(
    (g) => g.status === 'Submitted' || g.status === 'Under Review'
  ).length;
  const inProgressCount = grievances.filter(
    (g) => g.status === 'In Progress' || g.status === 'Assigned'
  ).length;
  const resolvedCount = grievances.filter(
    (g) => g.status === 'Resolved' || g.status === 'Closed'
  ).length;

  if (loading) return <Loading message="Loading staff grievance dashboard..." />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Staff Portal - Welcome, {user?.name || 'Staff Member'}</h1>
          <p className="page-subtitle">Manage and resolve assigned student grievances</p>
        </div>
        <Link to="/staff/grievances" className="btn btn-primary">
          View All Assigned ({assignedCount})
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Staff Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-data">
            <span className="stat-value">{assignedCount}</span>
            <span className="stat-label">Assigned Grievances</span>
          </div>
        </div>

        <div className="stat-card stat-review">
          <div className="stat-icon">⏳</div>
          <div className="stat-data">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>

        <div className="stat-card stat-progress">
          <div className="stat-icon">⚙️</div>
          <div className="stat-data">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-data">
            <span className="stat-value">{resolvedCount}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Recent Assigned Grievances */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <h2>Assigned Grievances Queue</h2>
          <Link to="/staff/grievances" className="see-all-link">
            Manage All →
          </Link>
        </div>

        {grievances.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🎉</div>
            <h3>Queue Clean!</h3>
            <p>No active grievances currently assigned to your staff profile.</p>
          </div>
        ) : (
          <div className="grievance-cards-grid">
            {grievances.slice(0, 4).map((grievance) => (
              <GrievanceCard key={grievance._id} grievance={grievance} role="staff" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StaffDashboard;
