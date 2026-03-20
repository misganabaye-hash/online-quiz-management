import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import { MailOutline, ArrowBack, LockOpen } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFindAccount = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/forgotPassword', { email });
            setResetToken(res.data.resetToken);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) return setError('Passwords do not match.');
        if (password.length < 8) return setError('Password must be at least 8 characters.');
        setLoading(true);
        try {
            await axios.patch(`/api/auth/resetPassword/${resetToken}`, { password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed.');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Container maxWidth="sm">
                <Card sx={{ borderRadius: 4, p: 2 }}>
                    <CardContent>
                        <Button startIcon={<ArrowBack />} onClick={() => navigate('/login')} sx={{ mb: 2, fontWeight: 700 }}>
                            Back to Login
                        </Button>

                        <Box textAlign="center" mb={4}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                                {step === 1 ? 'Recover Account' : 'Set New Password'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {step === 1 ? 'Enter your registered email to recover your account.' : 'Enter your new password below.'}
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

                        {step === 1 && (
                            <form onSubmit={handleFindAccount}>
                                <TextField
                                    fullWidth label="Email Address" type="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required
                                    InputProps={{ startAdornment: <MailOutline sx={{ mr: 1, color: 'action.active' }} /> }}
                                />
                                <Button fullWidth size="large" variant="contained" type="submit"
                                    disabled={loading} sx={{ mt: 4, py: 1.5 }}>
                                    {loading ? 'Checking...' : 'Continue'}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleResetPassword}>
                                <TextField
                                    fullWidth label="New Password" type="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required helperText="Minimum 8 characters"
                                    InputProps={{ startAdornment: <LockOpen sx={{ mr: 1, color: 'action.active' }} /> }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth label="Confirm New Password" type="password"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    InputProps={{ startAdornment: <LockOpen sx={{ mr: 1, color: 'action.active' }} /> }}
                                />
                                <Button fullWidth size="large" variant="contained" type="submit"
                                    disabled={loading} sx={{ mt: 4, py: 1.5 }}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ForgotPassword;
