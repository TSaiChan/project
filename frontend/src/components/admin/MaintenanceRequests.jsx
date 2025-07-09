// components/admin/MaintenanceRequests.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Alert,
    MenuItem, FormControl, InputLabel, Select, Tooltip, Stack, Fab
} from '@mui/material';
import {
    Build as BuildIcon, CheckCircle as CheckCircleIcon,
    Assignment as AssignmentIcon, Schedule as ScheduleIcon, Person as PersonIcon,
    LocationOn as LocationOnIcon, PriorityHigh as PriorityHighIcon,
    FilterList as FilterListIcon, Refresh as RefreshIcon,
    Assignment as TaskIcon, Phone as PhoneIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MaintenanceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [updatingRequest, setUpdatingRequest] = useState({
        status: '',
        assigned_to: '',
        notes: ''
    });

    const showAlert = useCallback((type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    }, []);

    const loadRequests = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/maintenance-requests');
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                showAlert('error', 'Failed to load maintenance requests');
            }
        } catch (error) {
            console.error('Error loading maintenance requests:', error);
            showAlert('error', 'Failed to load maintenance requests');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleUpdateStatus = async () => {
        if (!selectedRequest || !updatingRequest.status) {
            showAlert('error', 'Please select a status');
            return;
        }

        try {
            const response = await fetch(`/api/admin/maintenance-requests/${selectedRequest.request_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: updatingRequest.status,
                    assigned_to: updatingRequest.assigned_to,
                    notes: updatingRequest.notes
                })
            });

            if (response.ok) {
                await loadRequests();
                setUpdateDialogOpen(false);
                setUpdatingRequest({ status: '', assigned_to: '', notes: '' });
                setSelectedRequest(null);
                showAlert('success', 'Request updated successfully');
            } else {
                const error = await response.json();
                showAlert('error', error.message || 'Failed to update request');
            }
        } catch (error) {
            console.error('Error updating request:', error);
            showAlert('error', 'Failed to update request');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return '#ef4444';
            case 'in_progress': return '#f59e0b';
            case 'resolved': return '#10b981';
            case 'closed': return '#6b7280';
            default: return '#6b7280';
        }
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

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'urgent':
            case 'high':
                return <PriorityHighIcon fontSize="small" />;
            default:
                return <TaskIcon fontSize="small" />;
        }
    };

    const filteredRequests = requests.filter(request => {
        const statusMatch = statusFilter === 'all' || request.status === statusFilter;
        const priorityMatch = priorityFilter === 'all' || request.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });

    const getRequestCounts = () => {
        return {
            total: requests.length,
            open: requests.filter(r => r.status === 'open').length,
            in_progress: requests.filter(r => r.status === 'in_progress').length,
            resolved: requests.filter(r => r.status === 'resolved').length,
            urgent: requests.filter(r => r.priority === 'urgent').length
        };
    };

    const counts = getRequestCounts();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography variant="h6" color="textSecondary">Loading maintenance requests...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: '100%', margin: '0 auto' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center">
                        <BuildIcon sx={{ fontSize: 40, color: '#f59e0b', mr: 2 }} />
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="#ffffff">
                                Maintenance Requests
                            </Typography>
                            <Typography variant="subtitle1" color="#94a3b8">
                                Manage community maintenance requests
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Refresh">
                        <Fab
                            size="medium"
                            onClick={loadRequests}
                            sx={{
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                }
                            }}
                        >
                            <RefreshIcon />
                        </Fab>
                    </Tooltip>
                </Box>
            </motion.div>

            {/* Alert */}
            <AnimatePresence>
                {alert.show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{ marginBottom: '16px' }}
                    >
                        <Alert severity={alert.type} onClose={() => setAlert({ ...alert, show: false })}>
                            {alert.message}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3} md={2.4}>
                    <Card sx={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h6" color="#60a5fa" fontWeight="bold">
                                {counts.total}
                            </Typography>
                            <Typography variant="body2" color="#94a3b8">
                                Total
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3} md={2.4}>
                    <Card sx={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h6" color="#f87171" fontWeight="bold">
                                {counts.open}
                            </Typography>
                            <Typography variant="body2" color="#94a3b8">
                                Open
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3} md={2.4}>
                    <Card sx={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h6" color="#fbbf24" fontWeight="bold">
                                {counts.in_progress}
                            </Typography>
                            <Typography variant="body2" color="#94a3b8">
                                In Progress
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3} md={2.4}>
                    <Card sx={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h6" color="#34d399" fontWeight="bold">
                                {counts.resolved}
                            </Typography>
                            <Typography variant="body2" color="#94a3b8">
                                Resolved
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3} md={2.4}>
                    <Card sx={{
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h6" color="#f87171" fontWeight="bold">
                                {counts.urgent}
                            </Typography>
                            <Typography variant="body2" color="#94a3b8">
                                Urgent
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                mb: 3
            }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                        <FilterListIcon sx={{ color: '#94a3b8' }} />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{
                                    color: '#ffffff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                                <MenuItem value="closed">Closed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ color: '#94a3b8' }}>Priority</InputLabel>
                            <Select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                sx={{
                                    color: '#ffffff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }}
                            >
                                <MenuItem value="all">All Priority</MenuItem>
                                <MenuItem value="urgent">Urgent</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="low">Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            {/* Requests Table */}
            <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px'
            }}>
                <CardContent>
                    {filteredRequests.length > 0 ? (
                        <TableContainer component={Paper} sx={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            maxHeight: '600px'
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Request
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Resident
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Location
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Priority
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Created
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', background: 'rgba(10, 11, 30, 0.9)' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRequests.map((request) => (
                                        <motion.tr
                                            key={request.request_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            component={TableRow}
                                            sx={{
                                                '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.05)'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ color: '#e2e8f0' }}>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {request.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="#94a3b8">
                                                        {request.category}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: '#e2e8f0' }}>
                                                <Box display="flex" alignItems="center">
                                                    <PersonIcon sx={{ mr: 1, color: '#6ee7b7', fontSize: 18 }} />
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {request.resident_name}
                                                        </Typography>
                                                        {request.contact_number && (
                                                            <Box display="flex" alignItems="center">
                                                                <PhoneIcon sx={{ mr: 0.5, fontSize: 12, color: '#94a3b8' }} />
                                                                <Typography variant="caption" color="#94a3b8">
                                                                    {request.contact_number}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: '#e2e8f0' }}>
                                                <Box display="flex" alignItems="center">
                                                    <LocationOnIcon sx={{ mr: 1, color: '#60a5fa', fontSize: 18 }} />
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {request.plot_no}
                                                        </Typography>
                                                        {request.flat_no && (
                                                            <Typography variant="caption" color="#94a3b8">
                                                                Flat {request.flat_no}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getPriorityIcon(request.priority)}
                                                    label={request.priority.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        background: `${getPriorityColor(request.priority)}20`,
                                                        color: getPriorityColor(request.priority),
                                                        border: `1px solid ${getPriorityColor(request.priority)}40`,
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={request.status.replace('_', ' ').toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        background: `${getStatusColor(request.status)}20`,
                                                        color: getStatusColor(request.status),
                                                        border: `1px solid ${getStatusColor(request.status)}40`,
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: '#e2e8f0' }}>
                                                <Box display="flex" alignItems="center">
                                                    <ScheduleIcon sx={{ mr: 1, color: '#94a3b8', fontSize: 16 }} />
                                                    <Typography variant="caption">
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setDetailsDialogOpen(true);
                                                            }}
                                                            sx={{
                                                                color: '#3b82f6',
                                                                '&:hover': { background: 'rgba(59, 130, 246, 0.1)' }
                                                            }}
                                                        >
                                                            <AssignmentIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Update Status">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setUpdatingRequest({
                                                                    status: request.status,
                                                                    assigned_to: request.assigned_to || '',
                                                                    notes: ''
                                                                });
                                                                setUpdateDialogOpen(true);
                                                            }}
                                                            sx={{
                                                                color: '#10b981',
                                                                '&:hover': { background: 'rgba(16, 185, 129, 0.1)' }
                                                            }}
                                                        >
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            py={8}
                        >
                            <BuildIcon sx={{ fontSize: 64, color: '#475569', mb: 2 }} />
                            <Typography variant="h6" color="#94a3b8" gutterBottom>
                                No Maintenance Requests
                            </Typography>
                            <Typography variant="body2" color="#64748b" textAlign="center">
                                {statusFilter !== 'all' || priorityFilter !== 'all'
                                    ? 'No requests match your current filters'
                                    : 'No maintenance requests have been submitted yet'
                                }
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(10, 11, 30, 0.95)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ mr: 1, color: '#3b82f6' }} />
                    Request Details
                </DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" color="#ffffff" gutterBottom>
                                        {selectedRequest.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="#94a3b8">
                                        Resident
                                    </Typography>
                                    <Typography color="#ffffff">
                                        {selectedRequest.resident_name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="#94a3b8">
                                        Location
                                    </Typography>
                                    <Typography color="#ffffff">
                                        {selectedRequest.plot_no} {selectedRequest.flat_no && `- Flat ${selectedRequest.flat_no}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="#94a3b8">
                                        Priority
                                    </Typography>
                                    <Chip
                                        label={selectedRequest.priority.toUpperCase()}
                                        size="small"
                                        sx={{
                                            background: `${getPriorityColor(selectedRequest.priority)}20`,
                                            color: getPriorityColor(selectedRequest.priority),
                                            border: `1px solid ${getPriorityColor(selectedRequest.priority)}40`
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="#94a3b8">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={selectedRequest.status.replace('_', ' ').toUpperCase()}
                                        size="small"
                                        sx={{
                                            background: `${getStatusColor(selectedRequest.status)}20`,
                                            color: getStatusColor(selectedRequest.status),
                                            border: `1px solid ${getStatusColor(selectedRequest.status)}40`
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="#94a3b8" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography color="#ffffff" sx={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        p: 2,
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {selectedRequest.description}
                                    </Typography>
                                </Grid>
                                {selectedRequest.assigned_to && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="#94a3b8">
                                            Assigned To
                                        </Typography>
                                        <Typography color="#ffffff">
                                            {selectedRequest.assigned_to}
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="#94a3b8">
                                        Created At
                                    </Typography>
                                    <Typography color="#ffffff">
                                        {new Date(selectedRequest.created_at).toLocaleString()}
                                    </Typography>
                                </Grid>
                                {selectedRequest.updated_at && (
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="#94a3b8">
                                            Updated At
                                        </Typography>
                                        <Typography color="#ffffff">
                                            {new Date(selectedRequest.updated_at).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDetailsDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog
                open={updateDialogOpen}
                onClose={() => setUpdateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(10, 11, 30, 0.95)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ mr: 1, color: '#10b981' }} />
                    Update Request Status
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
                            <Select
                                value={updatingRequest.status}
                                onChange={(e) => setUpdatingRequest({ ...updatingRequest, status: e.target.value })}
                                sx={{
                                    color: '#ffffff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }}
                            >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                                <MenuItem value="closed">Closed</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Assign To (Optional)"
                            value={updatingRequest.assigned_to}
                            onChange={(e) => setUpdatingRequest({ ...updatingRequest, assigned_to: e.target.value })}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    color: '#ffffff',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' }
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes (Optional)"
                            value={updatingRequest.notes}
                            onChange={(e) => setUpdatingRequest({ ...updatingRequest, notes: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#ffffff',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setUpdateDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateStatus}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }
                        }}
                    >
                        Update Request
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MaintenanceRequests;