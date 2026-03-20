import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    CircularProgress
} from '@mui/material';
import {
    CheckCircle,
    History,
    Home,
    EmojiEvents
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResults = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.submission) {
        return (
            <Box p={10} textAlign="center">
                <Typography variant="h6">No result data found.</Typography>
                <Button onClick={() => navigate('/student')}>Go Home</Button>
            </Box>
        );
    }

    const { submission, quiz } = state;
    const percentage = (submission.score / quiz.totalMarks) * 100;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 8 }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                    <EmojiEvents sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />

                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Quiz Completed!</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>{quiz.title}</Typography>

                    <Box sx={{
                        py: 4,
                        mb: 4,
                        borderRadius: 4,
                        bgcolor: percentage >= 50 ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)',
                        border: '1px solid',
                        borderColor: percentage >= 50 ? 'success.main' : 'error.main'
                    }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: percentage >= 50 ? 'success.main' : 'error.main' }}>
                            {submission.score} / {quiz.totalMarks}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Your Final Score</Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
                        {percentage >= 80 ? "Outstanding performance! Keep it up!" :
                            percentage >= 50 ? "Good job! You've passed the assessment." :
                                "Don't give up! Review the material and try again."}
                    </Typography>

                    <Box display="flex" gap={2} justifyContent="center">
                        <Button
                            variant="contained"
                            startIcon={<Home />}
                            size="large"
                            onClick={() => navigate('/student')}
                            sx={{ borderRadius: 3, px: 4 }}
                        >
                            Back to Home
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<History />}
                            size="large"
                            onClick={() => navigate('/student/results')}
                            sx={{ borderRadius: 3, px: 4 }}
                        >
                            My History
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default QuizResults;
