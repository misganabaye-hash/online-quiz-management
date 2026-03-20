import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    MenuItem,
    Paper,
    Divider
} from '@mui/material';
import {
    PlusOne,
    Edit,
    Delete,
    QuestionAnswer,
    Timer,
    Assessment,
    AddCircleOutline,
    Quiz
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newQuiz, setNewQuiz] = useState({ title: '', description: '', course: '', duration: 30, totalMarks: 100, gradingRules: 'Standard' });
    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get('/api/instructor/quizzes', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setQuizzes(res.data.data.quizzes);

            // Also fetch courses for the dropdown
            const courseRes = await axios.get('/api/instructor/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(courseRes.data.data.courses || []);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleCreateQuiz = async () => {
        try {
            await axios.post('/api/instructor/quizzes', newQuiz, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOpen(false);
            fetchQuizzes();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage My Quizzes</Typography>
                    <Typography variant="body1" color="text.secondary">Dashboard for creating and managing your course assessments</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutline />}
                    size="large"
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: 3, px: 3 }}
                >
                    Create New Quiz
                </Button>
            </Box>

            {quizzes.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Quiz sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No quizzes created yet.</Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setOpen(true)}>Start by creating your first quiz</Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {quizzes.map((quiz) => (
                        <Grid item xs={12} md={6} lg={4} key={quiz._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Chip
                                            label={quiz.course?.title || 'General'}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontWeight: 700 }}
                                        />
                                        <Box display="flex" alignItems="center" color="text.secondary">
                                            <Timer sx={{ fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{quiz.duration} min</Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{quiz.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{quiz.description}</Typography>

                                    <Divider sx={{ my: 2, opacity: 0.5 }} />
                                    
                                    <Box mb={2}>
                                        <Typography variant="caption" color="text.secondary">Grading Rules</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{quiz.gradingRules || 'Standard'}</Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                            Marks: <span style={{ color: '#6366f1' }}>{quiz.totalMarks}</span>
                                        </Typography>
                                        <Box>
                                            <Tooltip title="View Submissions">
                                                <IconButton size="small" onClick={() => navigate(`/instructor/quiz/${quiz._id}/results`)}>
                                                    <Assessment fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Questions">
                                                <IconButton size="small" color="primary" onClick={() => navigate(`/instructor/quiz/${quiz._id}/questions`)}>
                                                    <QuestionAnswer fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Quiz Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Create New Quiz</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Grid container spacing={2} pt={1}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Quiz Title"
                                value={newQuiz.title}
                                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Description" multiline rows={3}
                                value={newQuiz.description}
                                onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth select label="Course"
                                value={newQuiz.course}
                                onChange={(e) => setNewQuiz({ ...newQuiz, course: e.target.value })}
                            >
                                {courses.length > 0 ? courses.map(c => (
                                    <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
                                )) : (
                                    <MenuItem disabled>No courses available</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth type="number" label="Duration (Minutes)"
                                value={newQuiz.duration}
                                onChange={(e) => setNewQuiz({ ...newQuiz, duration: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth type="number" label="Total Marks"
                                    value={newQuiz.totalMarks}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, totalMarks: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Optional Grading Rules" multiline rows={2}
                                    value={newQuiz.gradingRules}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, gradingRules: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
                    <Button onClick={handleCreateQuiz} variant="contained" sx={{ px: 4, borderRadius: 3, fontWeight: 700 }}>Create Quiz</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InstructorDashboard;
