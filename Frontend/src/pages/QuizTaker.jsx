import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import {
    ArrowForward,
    ArrowBack,
    Timer,
    CheckCircleOutline,
    AlarmOn
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizTaker = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`/api/student/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setQuiz(res.data.data.quiz);
                setQuestions(res.data.data.questions);
                setTimeLeft(res.data.data.quiz.duration * 60);
                setLoading(false);
            } catch (err) {
                console.error(err);
                navigate('/student');
            }
        };
        fetchQuiz();
    }, [quizId, navigate]);

    // Timer Logic
    useEffect(() => {
        if (loading || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    const handleAnswerSelect = (optionIdx) => {
        setAnswers({ ...answers, [currentQuestion._id]: optionIdx });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formattedAnswers = Object.keys(answers).map(qId => ({
                questionId: qId,
                selectedOption: answers[qId]
            }));

            const res = await axios.post('/api/student/submit', {
                quizId,
                answers: formattedAnswers
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            navigate(`/student/results/${res.data.data.submission._id}`, { state: { submission: res.data.data.submission, quiz } });
        } catch (err) {
            console.error(err);
            setSubmitting(false);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', py: 4 }}>
            <Container maxWidth="md">
                {/* Header with Timer */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{quiz.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{questions.length} Questions</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: timeLeft < 60 ? 'error.light' : 'primary.light',
                        color: 'white'
                    }}>
                        <Timer sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{formatTime(timeLeft)}</Typography>
                    </Box>
                </Paper>

                <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 8, borderRadius: 4 }} />

                {/* Question Area */}
                <Paper sx={{ p: 4, borderRadius: 4, minHeight: 300 }}>
                    <Box mb={3} display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                            Question {currentIdx + 1} of {questions.length}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{currentQuestion.marks} Mark(s)</Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>{currentQuestion.text}</Typography>

                    <RadioGroup
                        value={answers[currentQuestion._id] ?? ''}
                        onChange={(e) => handleAnswerSelect(Number(e.target.value))}
                    >
                        {currentQuestion.options.map((option, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: answers[currentQuestion._id] === idx ? 'primary.main' : 'rgba(0,0,0,0.1)',
                                    bgcolor: answers[currentQuestion._id] === idx ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                }}
                            >
                                <FormControlLabel
                                    value={idx}
                                    control={<Radio />}
                                    label={option}
                                    sx={{ width: '100%', m: 0, p: 1 }}
                                />
                            </Box>
                        ))}
                    </RadioGroup>

                    <Box mt={6} display="flex" justifyContent="space-between">
                        <Button
                            size="large"
                            startIcon={<ArrowBack />}
                            disabled={currentIdx === 0}
                            onClick={() => setCurrentIdx(currentIdx - 1)}
                        >
                            Previous
                        </Button>

                        {currentIdx === questions.length - 1 ? (
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={() => setShowConfirm(true)}
                                startIcon={<CheckCircleOutline />}
                                sx={{ borderRadius: 3, px: 4 }}
                            >
                                Finish Quiz
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => setCurrentIdx(currentIdx + 1)}
                                endIcon={<ArrowForward />}
                                sx={{ borderRadius: 3, px: 4 }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Submit Quiz?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to finish and submit your answers? You cannot change them after submission.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setShowConfirm(false)}>Review Answers</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        disabled={submitting}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : "Yes, Submit"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default QuizTaker;
