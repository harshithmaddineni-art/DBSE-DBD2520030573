import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import FaqDrawer from './components/FaqDrawer';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import StaffLogin from './pages/staff/StaffLogin';
import AdminLogin from './pages/admin/AdminLogin';
import LandingPage from './pages/LandingPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitGrievance from './pages/student/SubmitGrievance';
import MyGrievances from './pages/student/MyGrievances';
import GrievanceDetails from './pages/student/GrievanceDetails';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import AssignedGrievances from './pages/staff/AssignedGrievances';
import StaffGrievanceDetails from './pages/staff/StaffGrievanceDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import ManageDepartments from './pages/admin/ManageDepartments';

import './App.css';

const MainLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isFullScreenPage = ['/', '/login', '/signup', '/staff/login', '/admin/login'].includes(location.pathname);

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={toggleSidebar} onOpenFaq={() => setIsFaqOpen(true)} />
      <div className="app-main-body">
        {user && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
        
        <main className={isFullScreenPage ? "landing-main-content" : "main-content"}>
          <Routes>
            {/* Root Route Redirect */}
            <Route
              path="/"
              element={
                user ? (
                  user.role === 'admin' ? (
                    <Navigate to="/admin/dashboard" replace />
                  ) : user.role === 'staff' ? (
                    <Navigate to="/staff/dashboard" replace />
                  ) : (
                    <Navigate to="/student/dashboard" replace />
                  )
                ) : (
                  <LandingPage />
                )
              }
            />

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/student/login" element={<Login />} />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'staff', 'admin']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/submit-grievance" element={<SubmitGrievance />} />
              <Route path="/student/grievances" element={<MyGrievances />} />
              <Route path="/student/grievances/:id" element={<GrievanceDetails />} />
            </Route>

            {/* Staff Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/grievances" element={<AssignedGrievances />} />
              <Route path="/staff/grievances/:id" element={<StaffGrievanceDetails />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/departments" element={<ManageDepartments />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <FaqDrawer isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
