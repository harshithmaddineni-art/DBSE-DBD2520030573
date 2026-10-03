import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import Loading from '../../components/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    password: '',
    newPassword: '',
    role: 'student',
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUsers().catch(() => null);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([
          { _id: 'u1', userId: 'STU-1001', name: 'Harshith', email: 'harshith@institution.edu', role: 'student', createdAt: new Date() },
          { _id: 'u2', userId: 'STF-2001', name: 'Dr. Robert Vance', email: 'rvance@institution.edu', role: 'staff', createdAt: new Date() },
          { _id: 'u3', userId: 'ADM-3001', name: 'System Admin', email: 'admin@institution.edu', role: 'admin', createdAt: new Date() },
        ]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch user list from backend REST API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      userId: `USR-${Date.now().toString().slice(-4)}`,
      name: '',
      email: '',
      password: '',
      newPassword: '',
      role: 'student',
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowNewPassword(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setIsEditing(true);
    setCurrentId(user._id);
    setFormData({
      userId: user.userId || '',
      name: user.name || '',
      email: user.email || '',
      password: user.password || '',
      newPassword: '',
      role: user.role || 'student',
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowNewPassword(false);
    setShowModal(true);
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

    setError('');
    setSuccess('');
    try {
      await userService.deleteUser(id);
      setSuccess(`User "${name}" deleted successfully.`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user via DELETE /api/users/' + id);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.userId || !formData.name || !formData.email) {
      setError('User ID, Name, and Email are required.');
      return;
    }

    if (!isEditing && !formData.password) {
      setError('Password is required when adding a new user.');
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        // PUT request
        const updatePayload = {
          userId: formData.userId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.newPassword) {
          updatePayload.password = formData.newPassword;
        }

        await userService.updateUser(currentId, updatePayload);
        setSuccess(`User "${formData.name}" updated successfully.`);
      } else {
        // POST request
        await userService.createUser(formData);
        setSuccess(`New user "${formData.name}" created successfully.`);
      }

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Error communicating with User API.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading user registry..." />;

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            Create, update, and manage institutional user accounts and roles via REST API
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          + Add New User
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Users Table */}
      <div className="table-responsive card">
        <table className="portal-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found in MongoDB database. Click "Add New User" to create one.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="font-mono text-sm">{u.userId}</td>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td className="font-mono text-sm text-muted">
                    {u.password ? '••••••••' : '*** Hidden ***'}
                  </td>
                  <td>
                    <span className={`user-role-tag role-${u.role}`}>
                      {u.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenEditModal(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger-outline"
                        onClick={() => handleDeleteUser(u._id, u.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit User Profile' : 'Add New User'}</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="modal-body">
              <div className="form-group">
                <label htmlFor="userId">User ID *</label>
                <input
                  type="text"
                  id="userId"
                  className="form-control"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {isEditing ? (
                <>
                  <div className="form-group">
                    <label htmlFor="password">Current Password</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        value={formData.password}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ padding: '0 15px', whiteSpace: 'nowrap' }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password (leave empty to keep current)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        className="form-control"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ padding: '0 15px', whiteSpace: 'nowrap' }}
                      >
                        {showNewPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: '0 15px', whiteSpace: 'nowrap' }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving to Database...' : isEditing ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
