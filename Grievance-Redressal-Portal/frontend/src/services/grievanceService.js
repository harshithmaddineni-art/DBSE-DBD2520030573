import API from './api';

export const grievanceService = {
  // Get all grievances (populates student and assignedStaff)
  getGrievances: async () => {
    const response = await API.get('/grievances');
    return response.data;
  },

  // Get single grievance by MongoDB ID
  getGrievanceById: async (id) => {
    const response = await API.get(`/grievances/${id}`);
    return response.data;
  },

  // Create new grievance
  createGrievance: async (grievanceData) => {
    const response = await API.post('/grievances', grievanceData);
    return response.data;
  },

  // Update grievance by MongoDB ID (status, assignedStaff, comments/remarks, department, etc.)
  updateGrievance: async (id, updateData) => {
    const response = await API.put(`/grievances/${id}`, updateData);
    return response.data;
  },

  // Delete grievance by MongoDB ID
  deleteGrievance: async (id) => {
    const response = await API.delete(`/grievances/${id}`);
    return response.data;
  },
};

export default grievanceService;
