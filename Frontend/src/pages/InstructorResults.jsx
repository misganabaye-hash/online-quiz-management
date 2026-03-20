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
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Person,
    Assessment,
    CheckCircle,
    Timer
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const InstructorResults = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsRes, statsRes] = await Promise.all([
                    axios.get(`/api/instructor/quizzes/${quizId}/results`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get(`/api/instructor/quizzes/${quizId}/statistics`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);

                setQuiz(resultsRes.data.data.quiz);
                setSubmissions(resultsRes.data.data.submissions);
                setStatistics(statsRes.data.data.statistics);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [quizId]);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    if (!quiz) {
        return (
            <Box p={4}>
                <Typography variant="h6" color="error">Quiz not found</Typography>
            </Box>
        );
    }

    const getScoreColor = (score, totalMarks) => {
        const percentage = (score / totalMarks) * 100;
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'error';
    };

    return (
        <Box p={4}>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Quiz Results: {quiz.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {quiz.course?.title || 'General'} • {quiz.duration} minutes
                </Typography>
            </Box>

            {/* Statistics Cards */}
            {statistics && (
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                            {statistics.totalSubmissions}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                            Total Submissions
                                        </Typography>
                                    </Box>
                                    <CheckCircle sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                            {statistics.averageScore.toFixed(1)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                            Average Score
                                        </Typography>
                                    </Box>
                                    <Assessment sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                            {statistics.highestScore}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                            Highest Score
                                        </Typography>
                                    </Box>
                                    <TrendingUp sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                            {statistics.lowestScore}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                            Lowest Score
                                        </Typography>
                                    </Box>
                                    <TrendingDown sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Submissions Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box p={3} bgcolor="primary.main">
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                        Student Submissions ({submissions.length})
                    </Typography>
                </Box>

                {submissions.length === 0 ? (
                    <Box p={6} textAlign="center">
                        <Timer sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No submissions yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Students haven't attempted this quiz
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'grey.100' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Percentage</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Submitted At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map((submission) => {
                                    const percentage = ((submission.score / quiz.totalMarks) * 100).toFixed(1);
                                    return (
                                        <TableRow key={submission._id} hover>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                                                        <Person />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {submission.student?.name || 'Unknown'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {submission.student?.email || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                    {submission.score} / {quiz.totalMarks}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${percentage}%`}
                                                    color={getScoreColor(submission.score, quiz.totalMarks)}
                                                    size="small"
                                                    sx={{ fontWeight: 700 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(submission.createdAt).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default InstructorResults;
