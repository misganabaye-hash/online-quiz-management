import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await axios.patch(`/api/auth/resetPassword/${token}`, { password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. Token may be invalid.');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Container maxWidth="sm">
                <Card sx={{ borderRadius: 4, p: 2 }}>
                    <CardContent>
                        <Box textAlign="center" mb={4}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                                Set New Password
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Please enter your new secure password.
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                sx={{ mt: 4, py: 1.5 }}
                            >
                                Reset Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ResetPassword;
