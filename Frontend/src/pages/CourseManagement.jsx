import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { Add, School, Person } from '@mui/icons-material';
import axios from 'axios';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor: '' });

    const fetchData = async () => {
        try {
            const courseRes = await axios.get('/api/admin/courses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const instructorsRes = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setCourses(courseRes.data.data.courses || []);
            setInstructors(instructorsRes.data.data.users.filter(u => u.role === 'instructor'));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        try {
            await axios.post('/api/admin/courses', newCourse, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOpen(false);
            setNewCourse({ title: '', description: '', instructor: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Course Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ borderRadius: 3 }}>
                    Create Course
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>Course Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>Instructor</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700 }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course._id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <School sx={{ mr: 1, color: 'primary.main' }} />
                                        {course.title}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Person sx={{ mr: 1, color: 'secondary.main', fontSize: 20 }} />
                                        {course.instructor?.name || 'Unassigned'}
                                    </Box>
                                </TableCell>
                                <TableCell>{course.description || 'No description'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Create New Course</DialogTitle>
                <DialogContent>
                    <Box pt={1} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            fullWidth label="Course Title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        />
                        <TextField
                            fullWidth label="Description" multiline rows={2}
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        />
                        <TextField
                            fullWidth select label="Assign Instructor"
                            value={newCourse.instructor}
                            onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                        >
                            {instructors.map(inst => (
                                <MenuItem key={inst._id} value={inst._id}>{inst.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained" disabled={!newCourse.title || !newCourse.instructor}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CourseManagement;
