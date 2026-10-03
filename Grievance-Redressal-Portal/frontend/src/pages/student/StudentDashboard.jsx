import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import grievanceService from '../../services/grievanceService';
import GrievanceCard from '../../components/GrievanceCard';
import Loading from '../../components/Loading';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentGrievances = async () => {

    setLoading(true);
    setError('');
    try {
      const data = await grievanceService.getGrievances().catch(() => null);
      if (Array.isArray(data)) {
        const myGrievances = data.filter((g) => {
          if (!g.student) return true;
          if (typeof g.student === 'object') {
            return g.student._id === user?._id || g.student.userId === user?.userId || g.student.email === user?.email;
          }
          return g.student === user?._id;
        });
        setGrievances(myGrievances.length > 0 ? myGrievances : data);
      } else {
        setGrievances([]);
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
      setError('Unable to load grievances from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentGrievances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Calculate statistics
  const totalCount = grievances.length;
  const submittedCount = grievances.filter((g) => g.status === 'Submitted').length;
  const reviewCount = grievances.filter((g) => g.status === 'Under Review').length;
  const inProgressCount = grievances.filter(
    (g) => g.status === 'In Progress' || g.status === 'Assigned'
  ).length;
  const resolvedCount = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length;

  const recentGrievances = grievances.slice(0, 3);

  if (loading) return <Loading message="Loading dashboard statistics..." />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name || 'Student'}</h1>
          <p className="page-subtitle">Student Grievance Redressal Dashboard</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/student/submit-grievance" className="btn btn-primary">
            + Submit New Grievance
          </Link>
          <Link to="/student/grievances" className="btn btn-outline">
            View My Grievances
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Overview Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📄</div>
          <div className="stat-data">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total Submitted</span>
          </div>
        </div>

        <div className="stat-card stat-submitted">
          <div className="stat-icon">📥</div>
          <div className="stat-data">
            <span className="stat-value">{submittedCount}</span>
            <span className="stat-label">Submitted</span>
          </div>
        </div>

        <div className="stat-card stat-review">
          <div className="stat-icon">🔍</div>
          <div className="stat-data">
            <span className="stat-value">{reviewCount}</span>
            <span className="stat-label">Under Review</span>
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

      {/* Recent Grievances Section */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <h2>Recent Grievances</h2>
          <Link to="/student/grievances" className="see-all-link">
            See All ({totalCount}) →
          </Link>
        </div>

        {recentGrievances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Grievances Submitted Yet</h3>
            <p>Have an issue or inquiry? Submit a formal grievance for institutional resolution.</p>
            <Link to="/student/submit-grievance" className="btn btn-primary mt-3">
              Submit Your First Grievance
            </Link>
          </div>
        ) : (
          <div className="grievance-cards-grid">
            {recentGrievances.map((grievance) => (
              <GrievanceCard key={grievance._id} grievance={grievance} role="student" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
