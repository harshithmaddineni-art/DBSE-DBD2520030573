import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import grievanceService from '../../services/grievanceService';
import { calculateSLA } from '../../services/slaHelper';
import Loading from '../../components/Loading';

const StaffGrievanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update controls state
  const [newStatus, setNewStatus] = useState('');
  const [newComment, setNewComment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const statusOptions = [
    'Submitted',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed',
    'Rejected',
  ];



  const fetchGrievanceDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await grievanceService.getGrievanceById(id);
      setGrievance(data);
      setNewStatus(data.status || 'Under Review');
    } catch (err) {
      console.error('Error fetching grievance details:', err);
      setError('Unable to load grievance record from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievanceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    setError('');
    setUpdating(true);

    try {
      const payload = {
        status: newStatus,
      };

      const res = await grievanceService.updateGrievance(id, payload);
      setGrievance(res.grievance || res);
      setUpdateMsg('Grievance status updated successfully via PUT /api/grievances/' + id);
      setNewComment('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError(
        err.response?.data?.message || 'Failed to update status on backend REST API.'
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading message="Loading grievance detail record..." />;

  if (error || !grievance) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error || 'Grievance not found.'}</div>
        <button onClick={() => navigate('/staff/grievances')} className="btn btn-outline">
          ← Back to Assigned Queue
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
    status,
    student,
    createdAt,
    updatedAt,
  } = grievance;

  // Calculate SLA
  const sla = calculateSLA(createdAt, priority, status);

  return (
    <div className="page-container max-w-5xl">
      <div className="nav-back-bar">
        <button onClick={() => navigate('/staff/grievances')} className="btn-back">
          ← Back to Assigned Queue
        </button>
      </div>

      <div className="card details-card">
        <div className="details-header">
          <div className="header-badges">
            <span className="badge badge-status-assigned">Status: {status}</span>
            <span className="badge badge-priority-high">{priority} Priority</span>
            <span className={`badge ${sla.badgeClass}`}>{sla.slaLabel}</span>
          </div>
          <h1 className="details-title">{title}</h1>
          <p className="details-id">Grievance Ref ID: {id}</p>
        </div>

        {/* SLA Urgency Warning Banner for Staff */}
        <div className={`sla-staff-banner ${sla.isOverdue ? 'banner-overdue' : 'banner-ontrack'}`}>
          <div className="sla-banner-icon">{sla.isOverdue ? '⚠️' : '⏱️'}</div>
          <div>
            <strong>SLA Deadline Status:</strong> {sla.statusText}
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Category:</span>
            <span className="value">{category || 'General'}</span>
          </div>

          <div className="detail-item">
            <span className="label">Department:</span>
            <span className="value">{department || 'General'}</span>
          </div>

          <div className="detail-item">
            <span className="label">Student Name:</span>
            <span className="value">
              {student && typeof student === 'object' ? student.name : 'Student'}
            </span>
          </div>

          <div className="detail-item">
            <span className="label">Target SLA Deadline:</span>
            <span className={`value ${sla.isOverdue ? 'text-overdue' : ''}`}>{sla.deadline}</span>
          </div>

          <div className="detail-item">
            <span className="label">Submitted On:</span>
            <span className="value">{new Date(createdAt).toLocaleString()}</span>
          </div>

          <div className="detail-item">
            <span className="label">Last Modified:</span>
            <span className="value">{new Date(updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="details-section">
          <h3>Grievance Statement</h3>
          <div className="description-box">{description}</div>
        </div>
      </div>

      {/* Staff Action & Status Update Panel */}
      <div className="card form-card mt-4">
        <h3 className="mb-3">Staff Action Panel</h3>

        {updateMsg && <div className="alert alert-success">{updateMsg}</div>}

        <form onSubmit={handleUpdateStatus}>
          <div className="form-group">
            <label htmlFor="newStatus">Update Grievance Status *</label>
            <select
              id="newStatus"
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <small className="form-text-muted">
              Updating status will send a PUT request to <code>/api/grievances/{id}</code>
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="newComment">Add Staff Remark / Resolution Comment</label>
            <textarea
              id="newComment"
              className="form-control"
              rows="3"
              placeholder="Enter official action notes or resolution statement..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Updating Status on REST API...' : 'Save & Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffGrievanceDetails;
