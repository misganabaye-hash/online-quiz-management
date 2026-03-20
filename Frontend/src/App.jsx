import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // <-- Import the hook
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminUserApproval from './pages/AdminUserApproval';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorResults from './pages/InstructorResults';
import QuestionManager from './pages/QuestionManager';
import CourseManagement from './pages/CourseManagement';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import QuizTaker from './pages/QuizTaker';
import QuizResults from './pages/QuizResults';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import StudentHistory from './pages/StudentHistory';

// Protected Route using AuthContext
const ProtectedRoute = ({ children, allowedRoles, noLayout = false }) => {
    const { user } = useAuth(); // Get user from context

    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />;

    if (noLayout) return children;
    return <Layout>{children}</Layout>;
};
function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
            {/* Admin Dashboards */}
            <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="approvals" element={<AdminUserApproval />} />
                        <Route path="courses" element={<CourseManagement />} />
                    </Routes>
                </ProtectedRoute>
            } />
            {/* Instructor Dashboards */}
            <Route path="/instructor/*" element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                    <Routes>
                        <Route index element={<InstructorDashboard />} />
                        <Route path="quizzes" element={<InstructorDashboard />} />
                        <Route path="quiz/:quizId/questions" element={<QuestionManager />} />
                        <Route path="quiz/:quizId/results" element={<InstructorResults />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </ProtectedRoute>
            } />
            {/* Student Dashboards */}
            <Route path="/student/*" element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <Routes>
                        <Route index element={<StudentDashboard />} />
                        <Route path="quizzes" element={<StudentDashboard />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="results" element={<StudentHistory />} />
                        <Route path="results/:id" element={<QuizResults />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </ProtectedRoute>
            } />

            {/* Special: Quiz Taker (No Layout for Focus) */}
            <Route path="/student/quiz/:quizId" element={
                <ProtectedRoute allowedRoles={['student', 'admin']} noLayout={true}>
                    <QuizTaker />
                </ProtectedRoute>
            } />
        </Routes>
    );
}
export default App;

