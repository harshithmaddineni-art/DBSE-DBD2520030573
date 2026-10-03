import { Link } from 'react-router-dom';

const GrievanceCard = ({ grievance, role = 'student' }) => {
  if (!grievance) return null;

  const {
    _id,
    title,
    category,
    priority = 'Medium',
    status = 'Submitted',
    department,
    createdAt,
    student,
    assignedStaff,
  } = grievance;

  // Format date
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : 'N/A';

  // Determine detail link target based on role
  let detailLink = `/student/grievances/${_id}`;
  if (role === 'staff') detailLink = `/staff/grievances/${_id}`;
  if (role === 'admin') detailLink = `/student/grievances/${_id}`;

  // Priority CSS class helper
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

  // Status CSS class helper
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

  const staffName =
    assignedStaff && typeof assignedStaff === 'object'
      ? assignedStaff.name || assignedStaff.email
      : 'Pending Staff Allocation';

  return (
    <div className="grievance-card">
      <div className="card-header-flex">
        <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
        <span className={`badge ${getPriorityBadgeClass(priority)}`}>{priority} Priority</span>
      </div>

      <h3 className="grievance-card-title">{title}</h3>

      <div className="grievance-card-tracking-details">
        <p className="tracking-line">
          <strong>Category:</strong> {category || 'General'}
        </p>
        <p className="tracking-line">
          <strong>Department:</strong> {department || 'General Administration'}
        </p>
        <p className="tracking-line">
          <strong>Assigned Staff:</strong> <span className="assigned-tag">{staffName}</span>
        </p>
      </div>

      {student && typeof student === 'object' && role !== 'student' && (
        <p className="grievance-card-student">
          <strong>Submitted By:</strong> {student.name || student.userId || 'Student'}
        </p>
      )}

      <div className="card-footer-flex">
        <span className="date-text">{formattedDate}</span>
        <Link to={detailLink} className="btn btn-outline btn-sm">
          Track Status →
        </Link>
      </div>
    </div>
  );
};

export default GrievanceCard;
