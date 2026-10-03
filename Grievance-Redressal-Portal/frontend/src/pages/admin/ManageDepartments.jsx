import React, { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';
import Loading from '../../components/Loading';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await departmentService.getDepartments();
      if (Array.isArray(data)) {
        setDepartments(data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Could not connect to Department API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSeedDepartments = async () => {
    setSubmitting(true);
    setError('');
    setMsg('');
    try {
      const res = await departmentService.seedDepartments();
      setMsg(res.message || 'Default departments seeded successfully into MongoDB Atlas!');
      fetchDepartments();
    } catch (err) {
      console.error('Seed error:', err);
      setError(err.response?.data?.message || 'Failed to seed default departments.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    setSubmitting(true);
    setError('');
    setMsg('');

    try {
      const payload = {
        name: deptName.trim(),
        description: `Code: ${deptCode || 'GEN'} | Head: ${deptHead || 'N/A'}`,
      };

      await departmentService.createDepartment(payload);
      setMsg(`Department "${deptName}" created successfully in MongoDB database!`);
      setDeptName('');
      setDeptCode('');
      setDeptHead('');
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department on backend REST API.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDept = async (id, name) => {
    if (!window.confirm(`Delete department "${name}"?`)) return;

    setError('');
    setMsg('');
    try {
      await departmentService.deleteDepartment(id);
      setMsg(`Department "${name}" deleted successfully.`);
      fetchDepartments();
    } catch {
      setError('Failed to delete department.');
    }
  };

  if (loading) return <Loading message="Loading institutional departments..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex-between items-center">
          <div>
            <h1 className="page-title">Manage Institutional Departments</h1>
            <p className="page-subtitle">
              Configure academic departments and administrative units stored in MongoDB Atlas database
            </p>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleSeedDepartments}
            disabled={submitting}
          >
            ⚡ Seed Defaults into MongoDB
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-cols-2 gap-6">
        {/* Department Table Card */}
        <div className="card">
          <h2>Active Departments ({departments.length})</h2>
          {departments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted mb-3">No departments found in MongoDB database.</p>
              <button
                className="btn btn-primary"
                onClick={handleSeedDepartments}
                disabled={submitting}
              >
                + Seed Default Departments
              </button>
            </div>
          ) : (
            <div className="table-responsive mt-3">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Description / Info</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d._id}>
                      <td className="font-medium">{d.name}</td>
                      <td className="text-muted">{d.description || 'Institutional Department'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger-outline"
                          onClick={() => handleDeleteDept(d._id, d.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Department Form Card */}
        <div className="card">
          <h2>Add New Department</h2>
          <form onSubmit={handleAddDept} className="mt-3">
            <div className="form-group">
              <label htmlFor="deptName">Department Name *</label>
              <input
                type="text"
                id="deptName"
                className="form-control"
                placeholder="e.g. Civil Engineering"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deptCode">Department Code</label>
              <input
                type="text"
                id="deptCode"
                className="form-control"
                placeholder="e.g. CIVIL"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deptHead">Department Head / In-Charge</label>
              <input
                type="text"
                id="deptHead"
                className="form-control"
                placeholder="e.g. Prof. Alan Turing"
                value={deptHead}
                onChange={(e) => setDeptHead(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Saving to Database...' : '+ Add Department'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;
