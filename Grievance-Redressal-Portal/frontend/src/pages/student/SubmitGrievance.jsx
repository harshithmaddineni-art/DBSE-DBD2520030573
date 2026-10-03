import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import grievanceService from '../../services/grievanceService';
import categoryService from '../../services/categoryService';
import departmentService from '../../services/departmentService';

const SubmitGrievance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'Medium',
    department: 'Computer Science & Engineering',
  });

  const [categoriesList, setCategoriesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];



  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [catData, deptData] = await Promise.all([
        categoryService.getCategories().catch(() => []),
        departmentService.getDepartments().catch(() => []),
      ]);

      const fetchedCategories = Array.isArray(catData) && catData.length > 0
        ? catData.map(c => typeof c === 'string' ? c : c.name)
        : [
            'Academic',
            'Hostel & Accommodation',
            'Examination & Evaluation',
            'Library Services',
            'Infrastructure & Facilities',
            'Fee & Financial Services',
            'Canteen & Food Quality',
            'General Inquiry',
          ];

      const fetchedDepartments = Array.isArray(deptData) && deptData.length > 0
        ? deptData.map(d => typeof d === 'string' ? d : d.name)
        : [
            'Computer Science & Engineering',
            'Electrical & Electronics Engineering',
            'Mechanical Engineering',
            'Student Affairs',
            'Finance & Accounts',
            'Maintenance & Sanitation',
            'Library Administration',
            'General Administration',
          ];

      setCategoriesList(fetchedCategories);
      setDepartmentsList(fetchedDepartments);

      setFormData(prev => ({
        ...prev,
        category: fetchedCategories[0] || 'Academic',
        department: fetchedDepartments[0] || 'Computer Science & Engineering',
      }));
    } catch (err) {
      console.error('Error fetching backend categories/departments:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and Description are required fields.');
      return;
    }

    setSubmitting(true);

    try {
      let studentId = user?._id;
      if (studentId && !/^[0-9a-fA-F]{24}$/.test(studentId)) {
        // Fallback ID if using demo/offline mode
        studentId = '650000000000000000000001';
      } else if (!studentId) {
        studentId = '650000000000000000000001';
      }

      // Structure payload expected by Grievance schema in backend
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        department: formData.department,
        student: studentId,
      };

      await grievanceService.createGrievance(payload);
      setSuccess('Grievance submitted successfully! Redirecting to your grievances list...');
      
      setTimeout(() => {
        navigate('/student/grievances');
      }, 1500);
    } catch (err) {
      console.error('Error submitting grievance:', err);
      setError(
        err.response?.data?.message ||
          'Failed to submit grievance. Please verify backend connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">Submit a Grievance</h1>
        <p className="page-subtitle">
          File an official complaint or query to the institution administration
        </p>
      </div>

      <div className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Grievance Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Brief summary of your grievance..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="category">Category * {loadingOptions && <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>(Loading...)</span>}</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department">Target Department * {loadingOptions && <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>(Loading...)</span>}</label>
              <select
                id="department"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority Level *</label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              className="form-control"
              placeholder="Provide complete details including location, dates, courses, or specific incident details..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-info-box">
            <p>
              ℹ️ <strong>Note:</strong> Submitted grievances automatically start with status{' '}
              <span className="badge badge-status-submitted">Submitted</span>. Institutional staff will review and update status accordingly.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/student/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting to REST API...' : 'Submit Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitGrievance;
