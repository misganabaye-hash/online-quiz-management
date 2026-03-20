import api from './api';

const studentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  getAvailableQuizzes: () => api.get('/student/quizzes'),
  getQuiz: (quizId) => api.get(`/student/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => api.post(`/student/quizzes/${quizId}/submit`, { answers }),
  getMyResults: () => api.get('/student/results'),
  getResult: (resultId) => api.get(`/student/results/${resultId}`),
};

export default studentService;