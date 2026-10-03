import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import grievanceService from '../../services/grievanceService';
import Loading from '../../components/Loading';

const MyGrievances = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'



  const fetchGrievances = async () => {
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
      console.error('Error fetching grievances:', err);
      setError('Failed to load grievances from backend server.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...grievances];

    if (statusFilter !== 'All') {
      result = result.filter((g) => g.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.category?.toLowerCase().includes(q) ||
          g.department?.toLowerCase().includes(q) ||
          g._id?.toLowerCase().includes(q)
      );
    }

    setFilteredGrievances(result);
  };

  useEffect(() => {
    fetchGrievances();
     
  }, [user]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grievances, statusFilter, searchQuery]);

  const getPriorityBadgeClass = (p) => {
    switch (p?.toLowerCase()) {
      case 'urgent':
        return 'badge-priority-urgent';
      case 'high':
        return 'badge-priority-high';
      case 'medium':
        return 'badge-priority-medium';
      case 'low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-medium';
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'submitted':
        return 'badge-status-submitted';
      case 'under review':
        return 'badge-status-review';
      case 'assigned':
        return 'badge-status-assigned';
      case 'in progress':
        return 'badge-status-progress';
      case 'resolved':
        return 'badge-status-resolved';
      case 'closed':
        return 'badge-status-closed';
      case 'rejected':
        return 'badge-status-rejected';
      default:
        return 'badge-status-submitted';
    }
  };

  if (loading) return <Loading message="Loading grievances table..." />;

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">My Grievances</h1>
          <p className="page-subtitle">
            Track and monitor the status of all grievances you have submitted
          </p>
        </div>
        <Link to="/student/submit-grievance" className="btn btn-primary">
          + Submit New Grievance
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Controls Bar */}
      <div className="filter-bar card">
        <div className="filter-input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, Title, Category or Department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="view-toggle-buttons">
          <button
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('grid')}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Grievances Content */}
      {filteredGrievances.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📁</div>
          <h3>No Grievances Found</h3>
          <p>
            {searchQuery || statusFilter !== 'All'
              ? 'No grievances match your filter criteria.'
              : 'You have not submitted any grievances yet.'}
          </p>
          <button
            className="btn btn-outline mt-2"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-responsive card">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Grievance ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((item) => (
                <tr key={item._id}>
                  <td className="font-mono text-sm">
                    #{item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}
                  </td>
                  <td className="font-medium">{item.title}</td>
                  <td>{item.category || 'General'}</td>
                  <td>{item.department || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority || 'Medium'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status || 'Submitted'}
                    </span>
                  </td>
                  <td className="text-muted">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <Link
                      to={`/student/grievances/${item._id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grievance-cards-grid">
          {filteredGrievances.map((item) => (
            <div className="grievance-card" key={item._id}>
              <div className="card-header-flex">
                <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
                <span className={`badge ${getPriorityBadgeClass(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
              <h3 className="grievance-card-title">{item.title}</h3>
              <p className="grievance-card-meta">
                <strong>ID:</strong> #{item._id.slice(-6).toUpperCase()} |{' '}
                <strong>Category:</strong> {item.category}
              </p>
              <div className="card-footer-flex">
                <span className="date-text">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/student/grievances/${item._id}`}
                  className="btn btn-outline btn-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGrievances;
