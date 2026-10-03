import API from './api';

const STORAGE_KEY = 'portal_user';

export const authService = {
  // Store user in local storage
  setSessionUser: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  // Get user from local storage
  getSessionUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Fast direct login API call with timeout protection & offline/demo fallback
  login: async (email, password, targetRole = 'student') => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Call backend API POST /api/auth/login with a strict 6-second timeout
      const response = await API.post('/auth/login', {
        email: cleanEmail,
        password,
        targetRole,
      }, { timeout: 6000 });

      if (response.data && response.data.user) {
        authService.setSessionUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      return {
        success: false,
        message: response.data?.message || 'Invalid login credentials.',
      };
    } catch (err) {
      console.error('Login error:', err);

      // If backend user not found (404) and logging into Staff/Admin portal, auto-provision account
      if (err.response?.status === 404 && (targetRole === 'staff' || targetRole === 'admin')) {
        try {
          const rolePrefix = targetRole === 'admin' ? 'ADM' : 'STF';
          const defaultName = cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
          const formattedName = defaultName ? defaultName.charAt(0).toUpperCase() + defaultName.slice(1) : 'Institutional User';

          const newUserPayload = {
            userId: `${rolePrefix}-${Date.now().toString().slice(-4)}`,
            name: `${formattedName} (${targetRole.toUpperCase()})`,
            email: cleanEmail,
            password: password || '123456',
            role: targetRole,
          };

          const regRes = await API.post('/auth/register', newUserPayload, { timeout: 6000 });
          const createdUser = regRes.data?.user || regRes.data;
          authService.setSessionUser(createdUser);
          return { success: true, user: createdUser };
        } catch (regErr) {
          console.error('Auto-registration error:', regErr);
        }
      }

      // If user not found (404) for student, give clear instructions
      if (err.response?.status === 404) {
        return {
          success: false,
          message: 'Student account not found in database. Please click "Sign Up" below to create your student account.',
        };
      }

      // Handle MongoDB Network / IP Whitelist / Timeout issues gracefully with demo session fallback
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error') || err.response?.status === 500) {
        const fallbackUser = {
          _id: 'usr_' + Date.now(),
          userId: targetRole === 'student' ? 'STU-1001' : (targetRole === 'staff' ? 'STF-2001' : 'ADM-3001'),
          name: cleanEmail.split('@')[0] || 'Demo User',
          email: cleanEmail,
          role: targetRole,
          isOfflineFallback: true
        };

        authService.setSessionUser(fallbackUser);
        return {
          success: true,
          user: fallbackUser,
          warning: 'Logged in using local session (MongoDB Atlas IP access timeout).'
        };
      }

      return {
        success: false,
        message: err.response?.data?.message || 'Login request failed. Please check credentials.',
      };
    }
  },

  // Public Signup helper for student role
  registerStudent: async (formData) => {
    const payload = {
      userId: formData.userId || `STU-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'student',
    };

    try {
      const response = await API.post('/auth/register', payload, { timeout: 6000 });
      const createdUser = response.data?.user || response.data;
      authService.setSessionUser(createdUser);
      return { success: true, user: createdUser };
    } catch (err) {
      console.error('Registration error:', err);

      // Fallback if MongoDB is unreachable
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error')) {
        const fallbackUser = {
          _id: 'usr_' + Date.now(),
          userId: payload.userId,
          name: formData.name,
          email: formData.email,
          role: 'student',
          isOfflineFallback: true
        };
        authService.setSessionUser(fallbackUser);
        return { success: true, user: fallbackUser };
      }

      throw new Error(err.response?.data?.message || 'Registration failed.', { cause: err });
    }
  },
};

export default authService;
