import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Paper
} from '@mui/material';
import {
    PlayArrow,
    Timer,
    Assessment,
    Assignment
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get('/api/student/quizzes', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setQuizzes(res.data.data.quizzes);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box>
            <Box mb={4}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Search Your Quizzes</Typography>
                <Typography variant="body1" color="text.secondary">Select an available assessment to begin your attempt</Typography>
            </Box>

            {quizzes.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                    <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">No quizzes available for you at this time.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {quizzes.map((quiz) => (
                        <Grid item xs={12} md={6} lg={4} key={quiz._id}>
                            <Card sx={{
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-5px)' }
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Chip
                                            label={quiz.course?.title || 'General'}
                                            size="small"
                                            color="secondary"
                                            sx={{ fontWeight: 700 }}
                                        />
                                        <Box display="flex" alignItems="center" color="text.secondary">
                                            <Timer sx={{ fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="caption">{quiz.duration} mins</Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{quiz.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>{quiz.description}</Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            Total Marks: {quiz.totalMarks}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            endIcon={<PlayArrow />}
                                            onClick={() => navigate(`/student/quiz/${quiz._id}`)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Attempt
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default StudentDashboard;
