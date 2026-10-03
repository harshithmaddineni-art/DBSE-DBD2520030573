import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getSessionUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, targetRole = 'student') => {
    const res = await authService.login(email, password, targetRole);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const signup = async (formData) => {
    const res = await authService.registerStudent(formData);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (!user) return;
    // Student accounts are strictly locked to student role
    if (user.role === 'student' && newRole !== 'student') {
      return;
    }
    const updatedUser = { ...user, role: newRole };
    authService.setSessionUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        switchRole,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
