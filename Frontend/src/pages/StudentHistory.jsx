import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Button
} from '@mui/material';
import { Visibility, History as HistoryIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentHistory = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/student/history', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSubmissions(res.data.data.submissions);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box>
            <Box mb={4} display="flex" alignItems="center" gap={2}>
                <HistoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>My Quiz History</Typography>
                    <Typography variant="body1" color="text.secondary">Review your past performance and scores</Typography>
                </Box>
            </Box>

            {submissions.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                    <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">You haven't attempted any quizzes yet.</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, borderRadius: 2 }}
                        onClick={() => navigate('/student/quizzes')}
                    >
                        Browse Available Quizzes
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Quiz Title</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date Attempted</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Result</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.map((sub) => {
                                const percentage = (sub.score / sub.quiz.totalMarks) * 100;
                                const isPassed = percentage >= 50;

                                return (
                                    <TableRow key={sub._id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{sub.quiz?.title || 'Unknown Quiz'}</TableCell>
                                        <TableCell>
                                            {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            {sub.score} / {sub.quiz.totalMarks}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={isPassed ? 'Passed' : 'Failed'}
                                                color={isPassed ? 'success' : 'error'}
                                                size="small"
                                                sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => navigate(`/student/results/${sub._id}`, { state: { submission: sub, quiz: sub.quiz } })}
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default StudentHistory;
