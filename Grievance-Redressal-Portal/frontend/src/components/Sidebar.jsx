import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role || 'student';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-role-heading">
          {role.toUpperCase()} PORTAL
        </span>
        <button className="sidebar-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        {role === 'student' && (
          <>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/student/submit-grievance"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">✍️</span>
              <span>Submit Grievance</span>
            </NavLink>

            <NavLink
              to="/student/grievances"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">📋</span>
              <span>My Grievances</span>
            </NavLink>
          </>
        )}

        {role === 'staff' && (
          <>
            <NavLink
              to="/staff/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">📊</span>
              <span>Staff Dashboard</span>
            </NavLink>

            <NavLink
              to="/staff/grievances"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">📥</span>
              <span>Assigned Grievances</span>
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">📊</span>
              <span>Admin Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">👥</span>
              <span>Manage Users</span>
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">🏷️</span>
              <span>Categories</span>
            </NavLink>

            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">🏢</span>
              <span>Departments</span>
            </NavLink>
          </>
        )}
      </nav>

    </aside>
  );
};

export default Sidebar;
