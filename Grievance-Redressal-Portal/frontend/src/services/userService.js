import API from './api';

export const userService = {
  // Fetch all users
  getUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },

  // Create a user
  createUser: async (userData) => {
    const response = await API.post('/users', userData);
    return response.data;
  },

  // Update a user by MongoDB ID
  updateUser: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete a user by MongoDB ID
  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
