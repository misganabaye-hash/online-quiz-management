import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Avatar
} from '@mui/material';
import {
    People,
    School,
    Quiz,
    Assessment,
    Person,
    TrendingUp
} from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const res = await axios.get('/api/admin/statistics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStatistics(res.data.data.statistics);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'error';
            case 'instructor': return 'secondary';
            case 'student': return 'primary';
            default: return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box p={4}>
            <Box mb={4}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    System Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Overview of your quiz management system
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
                                        {statistics?.totalUsers || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                        Total Users
                                    </Typography>
                                </Box>
                                <People sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
                                        {statistics?.totalCourses || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                        Total Courses
                                    </Typography>
                                </Box>
                                <School sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
                                        {statistics?.totalQuizzes || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                        Total Quizzes
                                    </Typography>
                                </Box>
                                <Quiz sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
                                        {statistics?.totalSubmissions || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                        Submissions
                                    </Typography>
                                </Box>
                                <Assessment sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* User Breakdown by Role */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Users by Role
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {statistics?.usersByRole?.map((item) => (
                                <Box key={item._id} display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center">
                                        <Avatar sx={{ bgcolor: getRoleColor(item._id) + '.main', mr: 2 }}>
                                            <Person />
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                            {item._id}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={item.count}
                                        color={getRoleColor(item._id)}
                                        sx={{ fontWeight: 700, minWidth: 60 }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* User Breakdown by Status */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Users by Status
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {statistics?.usersByStatus?.map((item) => (
                                <Box key={item._id} display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center">
                                        <Avatar sx={{ bgcolor: getStatusColor(item._id) + '.main', mr: 2 }}>
                                            <TrendingUp />
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                            {item._id}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={item.count}
                                        color={getStatusColor(item._id)}
                                        sx={{ fontWeight: 700, minWidth: 60 }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Users */}
                <Grid item xs={12}>
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box p={3} bgcolor="primary.main">
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                Recent Registrations
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'grey.100' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Registered</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {statistics?.recentUsers?.map((user) => (
                                        <TableRow key={user._id} hover>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                                                        <Person />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {user.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role}
                                                    color={getRoleColor(user.role)}
                                                    size="small"
                                                    sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.status}
                                                    color={getStatusColor(user.status)}
                                                    size="small"
                                                    sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
