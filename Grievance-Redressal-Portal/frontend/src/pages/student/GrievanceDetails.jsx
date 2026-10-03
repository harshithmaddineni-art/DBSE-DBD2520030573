import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import grievanceService from '../../services/grievanceService';
import { calculateSLA } from '../../services/slaHelper';
import Loading from '../../components/Loading';

const GrievanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchGrievanceDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await grievanceService.getGrievanceById(id);
      setGrievance(data);
    } catch (err) {
      console.error('Error fetching grievance details:', err);
      setError('Failed to fetch grievance details from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievanceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loading message="Retrieving grievance record from backend database..." />;

  if (error || !grievance) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error || 'Grievance not found.'}</div>
        <button onClick={() => navigate(-1)} className="btn btn-outline">
          ← Back to Grievances
        </button>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    department,
    priority,
    status = 'Submitted',
    student,
    assignedStaff,
    createdAt,
    statusHistory = [],
  } = grievance;

  // SLA Calculation
  const sla = calculateSLA(createdAt, priority, status);

  // Tracking Progress helper
  const getStepStatus = (stepStage) => {
    const s = status.toLowerCase();
    if (s === 'rejected') return 'rejected';

    const stages = ['submitted', 'under review', 'assigned', 'in progress', 'resolved', 'closed'];
    const currentIdx = stages.indexOf(s);

    let targetIdx = 0;
    if (stepStage === 'submitted') targetIdx = 0;
    if (stepStage === 'review') targetIdx = 1;
    if (stepStage === 'progress') targetIdx = 3;
    if (stepStage === 'resolved') targetIdx = 4;

    if (currentIdx > targetIdx) return 'completed';
    if (currentIdx === targetIdx || (stepStage === 'progress' && s === 'assigned')) return 'current';
    return 'pending';
  };

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

  const staffName =
    assignedStaff && typeof assignedStaff === 'object'
      ? `${assignedStaff.name || 'Staff Member'} (${assignedStaff.email || ''})`
      : 'Pending Staff Allocation';

  return (
    <div className="page-container max-w-5xl">
      <div className="nav-back-bar">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back to List
        </button>
      </div>

      {/* Visual Tracking Progress Bar Card */}
      <div className="card tracking-progress-card">
        <div className="header-flex-sla">
          <div>
            <h2 className="tracking-card-title">🔍 Live Status & SLA Deadline Tracking</h2>
            <p className="tracking-card-subtitle">
              Real-time institutional progress tracking for Grievance Ref: #{grievance._id}
            </p>
          </div>
          <span className={`badge ${sla.badgeClass}`}>{sla.slaLabel}</span>
        </div>

        <div className="tracking-stepper">
          <div className={`stepper-step ${getStepStatus('submitted')}`}>
            <div className="step-icon">1</div>
            <span className="step-label">Submitted</span>
          </div>

          <div className="stepper-line"></div>

          <div className={`stepper-step ${getStepStatus('review')}`}>
            <div className="step-icon">2</div>
            <span className="step-label">Under Review</span>
          </div>

          <div className="stepper-line"></div>

          <div className={`stepper-step ${getStepStatus('progress')}`}>
            <div className="step-icon">3</div>
            <span className="step-label">In Progress</span>
          </div>

          <div className="stepper-line"></div>

          <div className={`stepper-step ${getStepStatus('resolved')}`}>
            <div className="step-icon">4</div>
            <span className="step-label">Resolved</span>
          </div>
        </div>

        {/* Current Location & SLA Banner */}
        <div className="tracking-info-banner">
          <div className="tracking-banner-item">
            <span className="banner-label">Current Stage:</span>
            <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
          </div>

          <div className="tracking-banner-item">
            <span className="banner-label">Department / Location:</span>
            <span className="banner-value">🏢 {department || 'General Administration'}</span>
          </div>

          <div className="tracking-banner-item">
            <span className="banner-label">Assigned Staff:</span>
            <span className="banner-value">👤 {staffName}</span>
          </div>

          <div className="tracking-banner-item">
            <span className="banner-label">Priority SLA Deadline:</span>
            <span className={`banner-value ${sla.isOverdue ? 'text-overdue' : 'text-sla-bold'}`}>
              {sla.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="card details-card mt-4">
        <div className="details-header">
          <div className="header-badges">
            <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
            <span className={`badge ${getPriorityBadgeClass(priority)}`}>{priority} Priority</span>
            <span className={`badge ${sla.badgeClass}`}>{sla.slaLabel}</span>
          </div>
          <h1 className="details-title">{title}</h1>
          <p className="details-id">Ref ID: {grievance._id}</p>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Category:</span>
            <span className="value">{category || 'General'}</span>
          </div>

          <div className="detail-item">
            <span className="label">Department:</span>
            <span className="value">{department || 'General Administration'}</span>
          </div>

          <div className="detail-item">
            <span className="label">Submitted By:</span>
            <span className="value">
              {student && typeof student === 'object'
                ? `${student.name || 'Student'} (${student.email || 'N/A'})`
                : 'Student'}
            </span>
          </div>

          <div className="detail-item">
            <span className="label">Assigned Staff:</span>
            <span className="value">{staffName}</span>
          </div>

          <div className="detail-item">
            <span className="label">Created Date:</span>
            <span className="value">{new Date(createdAt).toLocaleString()}</span>
          </div>

          <div className="detail-item">
            <span className="label">Target Resolution Deadline:</span>
            <span className={`value ${sla.isOverdue ? 'text-overdue' : ''}`}>{sla.deadline}</span>
          </div>
        </div>

        <div className="details-section">
          <h3>Grievance Description</h3>
          <div className="description-box">{description}</div>
        </div>

        {/* Resolution Information if Resolved */}
        {(status === 'Resolved' || status === 'Closed') && (
          <div className="details-section resolution-section">
            <h3>Resolution Details</h3>
            <div className="resolution-box">
              <p>
                ✅ This grievance has been officially reviewed and resolved by institutional authority within SLA targets.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Status History Timeline */}
      <div className="card details-card mt-4">
        <h3>Status History & Resolution Timeline</h3>
        {statusHistory.length === 0 ? (
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-content">
                <span className="timeline-status">Submitted</span>
                <span className="timeline-date">{new Date(createdAt).toLocaleString()}</span>
                <p>Grievance officially registered into database. Priority SLA deadline set for {sla.deadline}.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="timeline-container">
            {statusHistory.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-badge"></div>
                <div className="timeline-content">
                  <span className="timeline-status">{item.status}</span>
                  <span className="timeline-date">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                  </span>
                  {item.remarks && <p className="timeline-remarks">{item.remarks}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceDetails;
