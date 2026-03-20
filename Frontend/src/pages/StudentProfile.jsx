import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Person,
    Email,
    VpnKey,
    Edit,
    Save,
    Cancel,
    CalendarToday
} from '@mui/icons-material';
import axios from 'axios';

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [passwordDialog, setPasswordDialog] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/student/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(res.data.data.user);
            setFormData({ name: res.data.data.user.name, email: res.data.data.user.email });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile' });
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await axios.patch('/api/student/profile', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(res.data.data.user);
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        try {
            await axios.patch('/api/student/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPasswordDialog(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box p={4}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                My Profile
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Profile Information Card */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Personal Information
                            </Typography>
                            {!editing ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box display="flex" gap={1}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({ name: user.name, email: user.email });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleUpdateProfile}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!editing}
                                    InputProps={{
                                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!editing}
                                    InputProps={{
                                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Account Details Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Account Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Role
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                    {user?.role}
                                </Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Status
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize', color: user?.status === 'approved' ? 'success.main' : 'warning.main' }}>
                                    {user?.status}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                                    <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                                    Member Since
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Security
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<VpnKey />}
                                onClick={() => setPasswordDialog(true)}
                            >
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog
                open={passwordDialog}
                onClose={() => setPasswordDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
                <DialogContent>
                    <Box pt={1} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            fullWidth
                            type="password"
                            label="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            helperText="Minimum 8 characters"
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentProfile;
