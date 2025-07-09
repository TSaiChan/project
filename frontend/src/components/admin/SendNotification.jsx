// SendNotification.jsx - FIXED with proper light theme support
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Paper, Grid, Alert
} from '@mui/material';
import { Notifications, Send, People, LocationCity, HomeWork } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const SendNotification = () => {
    console.log('📢 SendNotification component rendered'); // Debug log

    const [orgId] = useState(1); // Replace with sessionStorage org_id if needed
    const [recipientType, setRecipientType] = useState('all');
    const [recipientId, setRecipientId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('normal');
    const [streets, setStreets] = useState([]);
    const [plots, setPlots] = useState([]);
    const [residents, setResidents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sRes, pRes, rRes] = await Promise.all([
                    axios.get(`/api/admin/streets/${orgId}`),
                    axios.get(`/api/admin/plots/${orgId}`),
                    axios.get(`/api/admin/residents/${orgId}`)
                ]);
                setStreets(sRes.data);
                setPlots(pRes.data);
                setResidents(rRes.data);
            } catch (err) {
                console.error('Failed to fetch dropdown data', err);
                // Set dummy data for testing
                setStreets([
                    { street_id: 1, street_name: 'Main Street' },
                    { street_id: 2, street_name: 'Garden Lane' },
                    { street_id: 3, street_name: 'Park Avenue' }
                ]);
                setPlots([
                    { plot_id: 1, plot_no: 'P-101' },
                    { plot_id: 2, plot_no: 'P-102' },
                    { plot_id: 3, plot_no: 'P-201' }
                ]);
                setResidents([
                    { resident_id: 1, name: 'John Doe', email: 'john@example.com' },
                    { resident_id: 2, name: 'Jane Smith', email: 'jane@example.com' },
                    { resident_id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
                ]);
            }
        };
        fetchData();
    }, [orgId]);

    const handleSubmit = async () => {
        if (!title || !message) {
            alert('Please fill in both title and message');
            return;
        }

        // Validate recipient selection for specific types
        if (recipientType !== 'all' && !recipientId) {
            alert('Please select a recipient');
            return;
        }

        setIsLoading(true);
        try {
            // Prepare recipient_id based on type
            let finalRecipientId = null;

            if (recipientType === 'all') {
                finalRecipientId = orgId; // Will be handled in backend, but sending orgId for consistency
            } else {
                finalRecipientId = recipientId;
            }

            await axios.post('/api/admin/notifications', {
                sender_id: 1, // TODO: replace with session user_id
                recipient_type: recipientType,
                recipient_id: finalRecipientId,
                title,
                message,
                priority
            });

            setSuccessMessage('Notification sent successfully!');
            setTitle('');
            setMessage('');
            setRecipientType('all');
            setRecipientId('');
            setPriority('normal');

            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (err) {
            console.error('Error sending notification:', err);
            alert('Error sending notification: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const getRecipientCount = () => {
        switch (recipientType) {
            case 'all':
                return residents.length;
            case 'street':
                // Count residents in selected street
                const streetPlots = plots.filter(p => p.street_id === recipientId);
                const streetPlotIds = streetPlots.map(p => p.plot_id);
                return residents.filter(r => streetPlotIds.includes(r.plot_id)).length || '?';
            case 'plot':
                return residents.filter(r => r.plot_id === recipientId).length || '?';
            case 'individual':
                return 1;
            default:
                return 0;
        }
    };

    return (
        <div style={{ padding: '24px', width: '100%' }} data-component="notification" className="send-notification">
            {/* Page Header */}
            <motion.div
                className="admin-page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div>
                    <Typography variant="h4" className="page-title" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Notifications sx={{ color: '#06b6d4' }} />
                        Send Notifications
                    </Typography>
                    <Typography variant="body2" className="page-subtitle">
                        Broadcast announcements to residents
                    </Typography>
                </div>
            </motion.div>

            {/* Success Message */}
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <Alert
                        severity="success"
                        sx={{ mb: 3, borderRadius: '12px' }}
                        onClose={() => setSuccessMessage('')}
                    >
                        {successMessage}
                    </Alert>
                </motion.div>
            )}

            <Grid container spacing={3}>
                {/* Notification Form */}
                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                📝 Create New Notification
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Recipient Type</InputLabel>
                                <Select
                                    value={recipientType}
                                    onChange={(e) => {
                                        setRecipientType(e.target.value);
                                        setRecipientId('');
                                    }}
                                    label="Recipient Type"
                                >
                                    <MenuItem value="all">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <People sx={{ color: '#06b6d4' }} />
                                            All Residents ({residents.length})
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="street">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationCity sx={{ color: '#3b82f6' }} />
                                            Specific Street
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="plot">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HomeWork sx={{ color: '#10b981' }} />
                                            Specific Plot
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="individual">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <People sx={{ color: '#8b5cf6' }} />
                                            Individual Resident
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {recipientType === 'street' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Select Street</InputLabel>
                                    <Select
                                        value={recipientId}
                                        onChange={(e) => setRecipientId(e.target.value)}
                                        label="Select Street"
                                    >
                                        {streets.map((s) => (
                                            <MenuItem key={s.street_id} value={s.street_id}>
                                                {s.street_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {recipientType === 'plot' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Select Plot</InputLabel>
                                    <Select
                                        value={recipientId}
                                        onChange={(e) => setRecipientId(e.target.value)}
                                        label="Select Plot"
                                    >
                                        {plots.map((p) => (
                                            <MenuItem key={p.plot_id} value={p.plot_id}>
                                                {p.plot_no} {p.street_name && `(${p.street_name})`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {recipientType === 'individual' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Select Resident</InputLabel>
                                    <Select
                                        value={recipientId}
                                        onChange={(e) => setRecipientId(e.target.value)}
                                        label="Select Resident"
                                    >
                                        {residents.map((r) => (
                                            <MenuItem key={r.resident_id} value={r.resident_id}>
                                                {r.name} ({r.email}) - {r.plot_no} {r.flat_no && `- ${r.flat_no}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            <TextField
                                fullWidth
                                label="Notification Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="Message Content"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    label="Priority"
                                >
                                    <MenuItem value="low">🔵 Low Priority</MenuItem>
                                    <MenuItem value="normal">⚪ Normal</MenuItem>
                                    <MenuItem value="high">🟡 High Priority</MenuItem>
                                    <MenuItem value="urgent">🔴 Urgent</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!title || !message || isLoading || (recipientType !== 'all' && !recipientId)}
                                startIcon={<Send />}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {isLoading ? 'Sending...' : 'Send Notification'}
                            </Button>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Preview & Info */}
                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                📊 Notification Summary
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Recipients:
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#06b6d4', fontWeight: 'bold' }}>
                                    {getRecipientCount()}
                                </Typography>
                                <Typography variant="body2">
                                    {recipientType === 'all' ? 'All residents' :
                                        recipientType === 'street' ? 'Street residents' :
                                            recipientType === 'plot' ? 'Plot residents' : 'Individual resident'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Priority:
                                </Typography>
                                <Box sx={{
                                    display: 'inline-block',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    backgroundColor: priority === 'urgent' ? 'rgba(239, 68, 68, 0.2)' :
                                        priority === 'high' ? 'rgba(245, 158, 11, 0.2)' :
                                            'rgba(6, 182, 212, 0.2)',
                                    color: priority === 'urgent' ? '#f87171' :
                                        priority === 'high' ? '#fbbf24' :
                                            '#22d3ee',
                                    fontWeight: 600,
                                    textTransform: 'capitalize'
                                }}>
                                    {priority}
                                </Box>
                            </Box>
                        </Paper>

                        {/* Preview */}
                        {(title || message) && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    👀 Preview
                                </Typography>

                                <Box sx={{
                                    p: 2,
                                    background: 'rgba(0, 0, 0, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0, 0, 0, 0.1)'
                                }}>
                                    {title && (
                                        <Typography variant="subtitle1" sx={{
                                            fontWeight: 600,
                                            mb: 1
                                        }}>
                                            {title}
                                        </Typography>
                                    )}
                                    {message && (
                                        <Typography variant="body2" sx={{
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {message}
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        )}
                    </motion.div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SendNotification;