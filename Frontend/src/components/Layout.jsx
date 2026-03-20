import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Quiz,
    People,
    History,
    Logout,
    School,
    Settings,
    Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', role: 'student' };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getMenuItems = () => {
        if (user.role === 'admin') {
            return [
                { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
                { text: 'User Approvals', icon: <People />, path: '/admin/approvals' },
                { text: 'Manage Courses', icon: <School />, path: '/admin/courses' },
            ];
        }
        if (user.role === 'instructor') {
            return [
                { text: 'My Quizzes', icon: <Quiz />, path: '/instructor/quizzes' },
            ];
        }
        return [
            { text: 'Available Quizzes', icon: <Quiz />, path: '/student/quizzes' },
            { text: 'My Scores', icon: <History />, path: '/student/results' },
            { text: 'Profile', icon: <People />, path: '/student/profile' },
        ];
    };

    const drawer = (
        <Box>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    <Quiz sx={{ mr: 1 }} /> QUIZ MASTER
                </Typography>
            </Toolbar>
            <Divider sx={{ opacity: 0.1 }} />
            <List sx={{ px: 2, mt: 2 }}>
                {getMenuItems().map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': { color: 'white' },
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ position: 'absolute', bottom: 20, width: '100%', px: 2 }}>
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                        {getMenuItems().find(m => m.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
                        </Box>
                        <Tooltip title="Profile Settings">
                            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>{user.name[0]}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            sx={{ mt: 1 }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={() => navigate('/student/profile')}><Person sx={{ mr: 1, fontSize: 20 }} /> My Profile</MenuItem>
                            <MenuItem onClick={handleMenuClose}><Settings sx={{ mr: 1, fontSize: 20 }} /> Settings</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><Logout sx={{ mr: 1, fontSize: 20 }} /> Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0,0,0,0.05)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
