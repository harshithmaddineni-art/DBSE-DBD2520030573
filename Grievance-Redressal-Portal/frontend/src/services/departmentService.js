import API from './api';

export const departmentService = {
  getDepartments: async () => {
    const response = await API.get('/departments');
    return response.data;
  },

  createDepartment: async (departmentData) => {
    const response = await API.post('/departments', departmentData);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await API.delete(`/departments/${id}`);
    return response.data;
  },

  seedDepartments: async () => {
    const response = await API.post('/departments/seed');
    return response.data;
  },
};

export default departmentService;
