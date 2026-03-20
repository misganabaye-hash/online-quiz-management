import api from './api';

const adminService = {
  getPendingUsers: () => api.get('/admin/users?status=pending'),
  approveUser: (userId) => api.put(`/admin/users/${userId}/approve`),
  rejectUser: (userId) => api.put(`/admin/users/${userId}/reject`),
  getAllUsers: () => api.get('/admin/users'),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  getCourses: () => api.get('/admin/courses'),
  updateCourse: (courseId, courseData) => api.put(`/admin/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  assignInstructor: (courseId, instructorId) => api.post(`/admin/courses/${courseId}/assign`, { instructorId }),
  getSystemStats: () => api.get('/admin/stats'),
};

export default adminService;
