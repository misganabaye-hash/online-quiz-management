import api from './api';

const instructorService = {
  createQuiz: (quizData) => api.post('/instructor/quizzes', quizData),
  getMyQuizzes: () => api.get('/instructor/quizzes'),
  getQuiz: (quizId) => api.get(`/instructor/quizzes/${quizId}`),
  updateQuiz: (quizId, quizData) => api.put(`/instructor/quizzes/${quizId}`, quizData),
  deleteQuiz: (quizId) => api.delete(`/instructor/quizzes/${quizId}`),
  addQuestion: (quizId, questionData) => api.post(`/instructor/quizzes/${quizId}/questions`, questionData),
  updateQuestion: (questionId, questionData) => api.put(`/instructor/questions/${questionId}`, questionData),
  deleteQuestion: (questionId) => api.delete(`/instructor/questions/${questionId}`),
  getQuizResults: (quizId) => api.get(`/instructor/quizzes/${quizId}/results`),
};

export default instructorService;
