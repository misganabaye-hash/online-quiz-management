import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import { Check, Close, Person } from '@mui/icons-material';
import axios from 'axios';

const UserApproval = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get('/api/admin/pending-users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(res.data.data.users);
            setLoading(false);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to fetch pending users' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleStatusUpdate = async (userId, status) => {
        try {
            await axios.patch('/api/admin/update-user-status', { userId, status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage({ type: 'success', text: `User ${status} successfully!` });
            fetchPendingUsers();
        } catch (err) {
            setMessage({ type: 'error', text: 'Action failed' });
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box p={4}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                User Approval Queue
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            {users.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">No pending approvals at the moment.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'secondary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Role</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Applied At</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Person sx={{ mr: 1, color: 'primary.light' }} />
                                            {user.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role.toUpperCase()}
                                            color={user.role === 'instructor' ? 'secondary' : 'default'}
                                            size="small"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<Check />}
                                                onClick={() => handleStatusUpdate(user._id, 'approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<Close />}
                                                onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UserApproval;
