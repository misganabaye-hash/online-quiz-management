import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    IconButton,
    Card,
    CardContent,
    Chip,
    Divider,
    CircularProgress,
    Collapse
} from '@mui/material';
import {
    Add,
    Delete,
    ChevronLeft,
    CheckCircle,
    HelpOutline,
    QuestionMark
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuestionManager = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [newQuestion, setNewQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        marks: 1
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/instructor/quizzes/${quizId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setQuiz(res.data.data.quiz);
            setQuestions(res.data.data.questions);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [quizId]);

    const handleAddQuestion = async () => {
        try {
            await axios.post('/api/instructor/questions', {
                ...newQuestion,
                quiz: quizId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAdding(false);
            setNewQuestion({ text: '', options: ['', '', '', ''], correctOption: 0, marks: 1 });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box>
            <Button
                startIcon={<ChevronLeft />}
                onClick={() => navigate('/instructor/quizzes')}
                sx={{ mb: 2, fontWeight: 700 }}
            >
                Back to Dashboard
            </Button>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{quiz?.title}</Typography>
                    <Typography variant="body1" color="text.secondary">Manage questions for this quiz</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAdding(!adding)}
                    sx={{ borderRadius: 3 }}
                >
                    {adding ? "Cancel" : "Add Question"}
                </Button>
            </Box>

            <Collapse in={adding}>
                <Paper sx={{ p: 4, mb: 4, borderRadius: 4, border: '2px solid', borderColor: 'primary.light' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>New Question</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Question Text"
                                multiline rows={2}
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                            />
                        </Grid>
                        {newQuestion.options.map((opt, idx) => (
                            <Grid item xs={12} md={6} key={idx}>
                                <Box display="flex" alignItems="center">
                                    <Radio
                                        checked={newQuestion.correctOption === idx}
                                        onChange={() => setNewQuestion({ ...newQuestion, correctOption: idx })}
                                        color="success"
                                    />
                                    <TextField
                                        fullWidth label={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    />
                                </Box>
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth type="number" label="Marks"
                                value={newQuestion.marks}
                                onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" onClick={() => setAdding(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleAddQuestion} disabled={!newQuestion.text}>Save Question</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Collapse>

            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Current Questions ({questions.length})
                </Typography>
                {questions.length === 0 ? (
                    <Typography color="text.secondary">No questions added yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {questions.map((q, qidx) => (
                            <Grid item xs={12} key={q._id}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" gap={2}>
                                                <Chip label={`Q${qidx + 1}`} color="primary" size="small" />
                                                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{q.text}</Typography>
                                            </Box>
                                            <Chip label={`${q.marks} Mark`} variant="outlined" size="small" />
                                        </Box>
                                        <Grid container spacing={1}>
                                            {q.options.map((opt, oidx) => (
                                                <Grid item xs={12} md={6} key={oidx}>
                                                    <Box
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            bgcolor: oidx === q.correctOption ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0,0,0,0.02)',
                                                            border: oidx === q.correctOption ? '1px solid #2e7d32' : '1px solid transparent',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        {oidx === q.correctOption && <CheckCircle sx={{ color: '#2e7d32', mr: 1, fontSize: 18 }} />}
                                                        <Typography variant="body2">{opt}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default QuestionManager;
