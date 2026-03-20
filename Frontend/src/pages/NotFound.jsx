import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            p={4}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 6,
                    borderRadius: 4,
                    textAlign: 'center',
                    maxWidth: 500
                }}
            >
                <ErrorOutline sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                    404
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Oops! The page you are looking for does not exist or is under development.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
                >
                    Go Back
                </Button>
            </Paper>
        </Box>
    );
};

export default NotFound;
