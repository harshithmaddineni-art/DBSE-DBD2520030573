import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import grievanceService from '../../services/grievanceService';
import Loading from '../../components/Loading';

const AssignedGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssignedGrievances = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await grievanceService.getGrievances();
      setGrievances(data);
    } catch (err) {
      console.error('Error fetching assigned grievances:', err);
      setError('Unable to load grievances from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedGrievances();
  }, []);

  useEffect(() => {
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
          g.department?.toLowerCase().includes(q)
      );
    }

    setFilteredGrievances(result);
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

  if (loading) return <Loading message="Loading assigned grievances..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Assigned Grievances Queue</h1>
        <p className="page-subtitle">
          Review, update status, and address student grievances assigned to your department
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Bar */}
      <div className="filter-bar card">
        <div className="filter-input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search grievance title, category, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <label htmlFor="staffStatusFilter">Filter Status:</label>
          <select
            id="staffStatusFilter"
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredGrievances.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <h3>No Grievances Found</h3>
          <p>No assigned grievances match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="table-responsive card">
          <table className="portal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((item) => (
                <tr key={item._id}>
                  <td className="font-mono text-sm">
                    #{item._id ? item._id.slice(-6).toUpperCase() : ''}
                  </td>
                  <td className="font-medium">{item.title}</td>
                  <td>
                    {item.student && typeof item.student === 'object'
                      ? item.student.name || 'Student'
                      : 'Student'}
                  </td>
                  <td>{item.category || 'General'}</td>
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
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td>
                    <Link
                      to={`/staff/grievances/${item._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Update / Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedGrievances;
