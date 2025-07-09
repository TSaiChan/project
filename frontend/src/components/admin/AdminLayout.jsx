// components/admin/AdminLayout.jsx - FIXED NAVIGATION
import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../config/axios'; // ✅ Import configured axios
import {
    AppBar, Toolbar, Typography, CssBaseline, Drawer, List, ListItem, ListItemIcon,
    ListItemText, Box, IconButton, Avatar, Chip, Divider, Tooltip, Popover,
    Paper, Badge, Button
} from '@mui/material';
import {
    People as PeopleIcon,
    Payments as PaymentsIcon,
    Assessment as AssessmentIcon,
    Menu as MenuIcon,
    LightMode, DarkMode,
    LocationCity as LocationCityIcon,
    HomeWork as HomeWorkIcon,
    Apartment as ApartmentIcon,
    Notifications as NotificationsIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    Build as BuildIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './AdminLayout.css';

const drawerWidth = 280;

const navItems = [
    {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/admin-dashboard',
        description: 'Overview and summary',
        color: '#6366f1'
    },
    {
        label: 'Streets Management',
        icon: <LocationCityIcon />,
        path: '/admin-dashboard/streets',
        description: 'Manage community streets',
        color: '#3b82f6'
    },
    {
        label: 'Plots Management',
        icon: <HomeWorkIcon />,
        path: '/admin-dashboard/plots',
        description: 'Oversee plot assignments',
        color: '#10b981'
    },
    {
        label: 'Flats Management',
        icon: <ApartmentIcon />,
        path: '/admin-dashboard/flats',
        description: 'Manage flats within plots',
        color: '#14b8a6'
    },
    {
        label: 'Residents Management',
        icon: <PeopleIcon />,
        path: '/admin-dashboard/residents',
        description: 'Manage resident profiles',
        color: '#8b5cf6'
    },
    {
        label: 'Payments Management',
        icon: <PaymentsIcon />,
        path: '/admin-dashboard/payments',
        description: 'Handle payment processing',
        color: '#f59e0b'
    },
    {
        label: 'Maintenance Requests',
        icon: <BuildIcon />,
        path: '/admin-dashboard/maintenance-requests',
        description: 'Manage maintenance requests',
        color: '#f59e0b'
    },
    {
        label: 'Reports & Analytics',
        icon: <AssessmentIcon />,
        path: '/admin-dashboard/reports',
        description: 'View detailed analytics',
        color: '#ef4444'
    },
    {
        label: 'Send Notifications',
        icon: <NotificationsIcon />,
        path: '/admin-dashboard/send-notifications',
        description: 'Broadcast announcements',
        color: '#06b6d4'
    },
];

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [notificationsAnchor, setNotificationsAnchor] = useState(null);
    const [recentRequests, setRecentRequests] = useState([]);
    const [requestsCount, setRequestsCount] = useState(0);

    const loadRecentRequests = useCallback(async () => {
        try {
            // ✅ Changed from fetch to axios
            const response = await axios.get('/api/admin/maintenance-requests/recent');
            setRecentRequests(response.data);
            setRequestsCount(response.data.filter(req => req.status === 'open').length);
        } catch (error) {
            console.error('Error loading recent requests:', error);
        }
    }, []);

    useEffect(() => {
        setIsLoaded(true);
        loadRecentRequests();
    }, [loadRecentRequests]);

    const handleNotificationsClick = (event) => {
        setNotificationsAnchor(event.currentTarget);
        loadRecentRequests(); // Refresh when opened
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchor(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return '#dc2626';
            case 'high': return '#ea580c';
            case 'normal': return '#0891b2';
            case 'low': return '#059669';
            default: return '#6b7280';
        }
    };

    const handleThemeToggle = () => setDarkMode(!darkMode);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        // Add smooth logout animation
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.8';

        setTimeout(() => {
            sessionStorage.clear();
            localStorage.clear();
            navigate('/');
            document.body.style.opacity = '1';
        }, 300);
    };

    const getActiveItem = () => {
        return navItems.find(item => item.path === location.pathname);
    };

    const activeItem = getActiveItem();

    const drawer = (
        <Box className={`admin-sidebar ${darkMode ? 'dark' : 'light'}`}>
            {/* Sidebar Header */}
            <motion.div
                className="sidebar-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="logo-section">
                    <div className="logo-wrapper">
                        <div className="logo-icon">
                            <span className="logo-emoji">🏠</span>
                            <div className="logo-glow"></div>
                        </div>
                        <div className="logo-sparkle">✨</div>
                    </div>
                    <div className="brand-info">
                        <Typography variant="h6" className="brand-title">
                            GCMS Admin
                        </Typography>
                        <Typography variant="caption" className="brand-subtitle">
                            Management Portal
                        </Typography>
                    </div>
                </div>
            </motion.div>

            <Divider className="header-divider" />

            {/* Admin Profile Section */}
            <motion.div
                className="admin-profile"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Avatar className="admin-avatar" sx={{ width: 48, height: 48 }}>
                    A
                </Avatar>
                <div className="admin-info">
                    <Typography variant="subtitle1" className="admin-name">
                        Admin User
                    </Typography>
                    <Chip
                        label="Administrator"
                        size="small"
                        className="admin-role-chip"
                    />
                </div>
            </motion.div>

            <Divider className="profile-divider" />

            {/* Navigation Items */}
            <List className="nav-list" disablePadding>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <div key={item.label} className="nav-item-wrapper">
                            <Tooltip title={item.description} placement="right" arrow>
                                <ListItem
                                    button
                                    component={Link}
                                    to={item.path}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    disablePadding
                                >
                                    <ListItemIcon className="nav-icon">
                                        <div className="icon-wrapper">
                                            {item.icon}
                                            <div className="icon-glow"></div>
                                        </div>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        className="nav-text"
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 600 : 500
                                        }}
                                    />
                                    {isActive && (
                                        <div className="active-indicator" />
                                    )}
                                </ListItem>
                            </Tooltip>
                        </div>
                    );
                })}
            </List>

            {/* Bottom Actions */}
            <div className="sidebar-bottom">
                <Divider className="bottom-divider" />
                <motion.div
                    className="bottom-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Tooltip title="Settings" placement="right">
                        <IconButton className="action-btn settings-btn">
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Logout" placement="right">
                        <IconButton className="action-btn logout-btn" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </motion.div>
            </div>
        </Box>
    );

    return (
        <div className={`admin-layout ${darkMode ? 'dark-theme' : 'light-theme'} ${isLoaded ? 'loaded' : ''}`}>
            <CssBaseline />

            {/* Background Effects */}
            <div className="admin-bg-effects">
                <div className="bg-shape bg-shape-1"></div>
                <div className="bg-shape bg-shape-2"></div>
                <div className="bg-shape bg-shape-3"></div>
                <div className="bg-particles">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className={`particle particle-${i + 1}`}></div>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    display: { xs: 'none', sm: 'block' }
                }}
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                            position: 'fixed',
                            height: '100vh'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Mobile Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    display: { xs: 'block', sm: 'none' }
                }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Top AppBar */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <AppBar
                    position="fixed"
                    className="admin-appbar"
                >
                    <Toolbar className="appbar-toolbar">
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className="mobile-menu-btn"
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Page Title with breadcrumb */}
                        <div className="page-title-section">
                            <Typography variant="h5" className="page-title">
                                {activeItem?.label || 'Dashboard'}
                            </Typography>
                            <Typography variant="body2" className="page-subtitle">
                                {activeItem?.description || 'Welcome to GCMS Admin'}
                            </Typography>
                        </div>

                        <div className="appbar-actions">
                            {/* Search */}
                            <Tooltip title="Search" arrow>
                                <IconButton className="action-icon search-btn">
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>

                            {/* Theme Toggle */}
                            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'} arrow>
                                <IconButton
                                    onClick={handleThemeToggle}
                                    className="action-icon theme-toggle"
                                >
                                    <motion.div
                                        key={darkMode ? 'dark' : 'light'}
                                        initial={{ rotate: -180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {darkMode ? <LightMode /> : <DarkMode />}
                                    </motion.div>
                                </IconButton>
                            </Tooltip>

                            {/* Notifications */}
                            <Tooltip title="Maintenance Requests" arrow>
                                <IconButton
                                    className="action-icon notifications-btn"
                                    onClick={handleNotificationsClick}
                                >
                                    <Badge badgeContent={requestsCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            {/* Notifications Popover */}
                            <Popover
                                open={Boolean(notificationsAnchor)}
                                anchorEl={notificationsAnchor}
                                onClose={handleNotificationsClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                PaperProps={{
                                    sx: {
                                        background: 'rgba(10, 11, 30, 0.95)',
                                        backdropFilter: 'blur(30px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        mt: 1,
                                        minWidth: 350,
                                        maxWidth: 400,
                                        maxHeight: 500
                                    }
                                }}
                            >
                                <Box sx={{ p: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" color="#ffffff" display="flex" alignItems="center">
                                            <BuildIcon sx={{ mr: 1, color: '#f59e0b' }} />
                                            Maintenance Requests
                                        </Typography>
                                        {requestsCount > 0 && (
                                            <Chip
                                                label={`${requestsCount} Open`}
                                                size="small"
                                                sx={{
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)'
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {recentRequests.length > 0 ? (
                                        <>
                                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                                {recentRequests.slice(0, 5).map((request) => (
                                                    <Paper
                                                        key={request.request_id}
                                                        sx={{
                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '8px',
                                                            p: 2,
                                                            mb: 1,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                background: 'rgba(255, 255, 255, 0.08)'
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            handleNotificationsClose();
                                                            navigate('/admin-dashboard/maintenance-requests');
                                                        }}
                                                    >
                                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                                            <Typography variant="subtitle2" color="#ffffff" fontWeight="bold">
                                                                {request.title}
                                                            </Typography>
                                                            <Chip
                                                                label={request.priority.toUpperCase()}
                                                                size="small"
                                                                sx={{
                                                                    background: `${getPriorityColor(request.priority)}20`,
                                                                    color: getPriorityColor(request.priority),
                                                                    border: `1px solid ${getPriorityColor(request.priority)}40`,
                                                                    fontSize: '0.7rem'
                                                                }}
                                                            />
                                                        </Box>
                                                        <Typography variant="body2" color="#94a3b8" gutterBottom>
                                                            {request.resident_name} • {request.plot_no}
                                                            {request.flat_no && ` - Flat ${request.flat_no}`}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                                            <Typography variant="caption" color="#64748b" display="flex" alignItems="center">
                                                                <ScheduleIcon sx={{ mr: 0.5, fontSize: 12 }} />
                                                                {new Date(request.created_at).toLocaleDateString()}
                                                            </Typography>
                                                            <Chip
                                                                label={request.status.replace('_', ' ').toUpperCase()}
                                                                size="small"
                                                                sx={{
                                                                    background: request.status === 'open' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                                    color: request.status === 'open' ? '#ef4444' : '#f59e0b',
                                                                    border: `1px solid ${request.status === 'open' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                                                    fontSize: '0.6rem'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>

                                            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => {
                                                    handleNotificationsClose();
                                                    navigate('/admin-dashboard/maintenance-requests');
                                                }}
                                                sx={{
                                                    borderColor: '#3b82f6',
                                                    color: '#3b82f6',
                                                    '&:hover': {
                                                        borderColor: '#2563eb',
                                                        background: 'rgba(59, 130, 246, 0.1)'
                                                    }
                                                }}
                                            >
                                                View All Requests ({recentRequests.length})
                                            </Button>
                                        </>
                                    ) : (
                                        <Box textAlign="center" py={3}>
                                            <BuildIcon sx={{ fontSize: 48, color: '#475569', mb: 1 }} />
                                            <Typography variant="body2" color="#94a3b8">
                                                No maintenance requests
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Popover>
                        </div>
                    </Toolbar>
                </AppBar>
            </motion.div>

            {/* Main Content */}
            <div className="admin-main-content">
                <motion.div
                    className="content-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLayout;