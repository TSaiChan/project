// components/admin/FlatsManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Chip, Alert,
    List, ListItem, ListItemText, Tooltip, Stack
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
    Home as HomeIcon, Apartment as ApartmentIcon,
    LocationCity as LocationCityIcon, ElectricBolt as ElectricBoltIcon,
    Save as SaveIcon, AddHome as AddHomeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const FlatsManagement = () => {
    const [plots, setPlots] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [flats, setFlats] = useState([]);
    const [streets, setStreets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingFlat, setEditingFlat] = useState(null);
    const [newFlat, setNewFlat] = useState({ flat_no: '', eb_card: '' });
    const [bulkFlats, setBulkFlats] = useState('');
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const showAlert = useCallback((type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    }, []);

    const loadFlats = useCallback(async (plotId) => {
        try {
            const response = await fetch(`/api/admin/flats/plot/${plotId}`);
            if (response.ok) {
                const data = await response.json();
                setFlats(data);
            }
        } catch (error) {
            console.error('Error loading flats:', error);
            showAlert('error', 'Failed to load flats');
        }
    }, [showAlert]);

    // Load data on component mount
    useEffect(() => {
        const loadPlots = async () => {
            try {
                const response = await fetch('/api/admin/plots');
                if (response.ok) {
                    const data = await response.json();
                    setPlots(data);
                }
            } catch (error) {
                console.error('Error loading plots:', error);
            }
        };

        const loadStreets = async () => {
            try {
                const response = await fetch('/api/admin/streets');
                if (response.ok) {
                    const data = await response.json();
                    setStreets(data);
                }
            } catch (error) {
                console.error('Error loading streets:', error);
            }
        };

        const loadData = async () => {
            try {
                setLoading(true);
                await Promise.all([loadPlots(), loadStreets()]);
            } catch (error) {
                showAlert('error', 'Failed to load data');
                console.error('Error loading initial data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [showAlert]);

    // Load flats when plot is selected
    useEffect(() => {
        if (selectedPlot) {
            loadFlats(selectedPlot.plot_id);
        }
    }, [selectedPlot, loadFlats]);

    const handleAddFlat = async () => {
        if (!newFlat.flat_no.trim()) {
            showAlert('error', 'Flat number is required');
            return;
        }

        try {
            const response = await fetch('/api/admin/flats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newFlat,
                    plot_id: selectedPlot.plot_id
                })
            });

            if (response.ok) {
                await loadFlats(selectedPlot.plot_id);
                setDialogOpen(false);
                setNewFlat({ flat_no: '', eb_card: '' });
                showAlert('success', 'Flat added successfully');
            } else {
                const error = await response.json();
                showAlert('error', error.message || 'Failed to add flat');
            }
        } catch (error) {
            console.error('Error adding flat:', error);
            showAlert('error', 'Failed to add flat');
        }
    };

    const handleBulkAdd = async () => {
        if (!bulkFlats.trim()) {
            showAlert('error', 'Please enter flat numbers');
            return;
        }

        const flatNumbers = bulkFlats.split('\n').filter(line => line.trim());
        const flatsToAdd = flatNumbers.map(line => {
            const parts = line.split(',').map(p => p.trim());
            return {
                plot_id: selectedPlot.plot_id,
                flat_no: parts[0],
                eb_card: parts[1] || ''
            };
        });

        try {
            const response = await fetch('/api/admin/flats/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flats: flatsToAdd })
            });

            if (response.ok) {
                await loadFlats(selectedPlot.plot_id);
                setBulkDialogOpen(false);
                setBulkFlats('');
                showAlert('success', `${flatNumbers.length} flats added successfully`);
            } else {
                const error = await response.json();
                showAlert('error', error.message || 'Failed to add flats');
            }
        } catch (error) {
            console.error('Error adding flats:', error);
            showAlert('error', 'Failed to add flats');
        }
    };

    const handleEditFlat = async () => {
        if (!editingFlat.flat_no.trim()) {
            showAlert('error', 'Flat number is required');
            return;
        }

        try {
            const response = await fetch(`/api/admin/flats/${editingFlat.flat_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingFlat)
            });

            if (response.ok) {
                await loadFlats(selectedPlot.plot_id);
                setEditDialogOpen(false);
                setEditingFlat(null);
                showAlert('success', 'Flat updated successfully');
            } else {
                const error = await response.json();
                showAlert('error', error.message || 'Failed to update flat');
            }
        } catch (error) {
            console.error('Error updating flat:', error);
            showAlert('error', 'Failed to update flat');
        }
    };

    const handleDeleteFlat = async (flatId) => {
        if (!window.confirm('Are you sure you want to delete this flat?')) return;

        try {
            const response = await fetch(`/api/admin/flats/${flatId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadFlats(selectedPlot.plot_id);
                showAlert('success', 'Flat deleted successfully');
            } else {
                const error = await response.json();
                showAlert('error', error.message || 'Failed to delete flat');
            }
        } catch (error) {
            console.error('Error deleting flat:', error);
            showAlert('error', 'Failed to delete flat');
        }
    };

    const getStreetName = (streetId) => {
        const street = streets.find(s => s.street_id === streetId);
        return street ? street.street_name : 'Unknown Street';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography variant="h6" color="textSecondary">Loading...</Typography>
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
                <Box display="flex" alignItems="center" mb={3}>
                    <ApartmentIcon sx={{ fontSize: 40, color: '#10b981', mr: 2 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#ffffff">
                            Flats Management
                        </Typography>
                        <Typography variant="subtitle1" color="#94a3b8">
                            Manage flats within your plots
                        </Typography>
                    </Box>
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

            <Grid container spacing={3}>
                {/* Plots Selection */}
                <Grid item xs={12} md={4}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            height: 'fit-content'
                        }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#ffffff" display="flex" alignItems="center">
                                    <LocationCityIcon sx={{ mr: 1, color: '#3b82f6' }} />
                                    Select Plot
                                </Typography>
                                <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                                    {plots.map((plot) => (
                                        <ListItem
                                            key={plot.plot_id}
                                            button
                                            selected={selectedPlot?.plot_id === plot.plot_id}
                                            onClick={() => setSelectedPlot(plot)}
                                            sx={{
                                                borderRadius: '8px',
                                                mb: 1,
                                                background: selectedPlot?.plot_id === plot.plot_id
                                                    ? 'rgba(16, 185, 129, 0.2)'
                                                    : 'rgba(255, 255, 255, 0.03)',
                                                border: selectedPlot?.plot_id === plot.plot_id
                                                    ? '1px solid rgba(16, 185, 129, 0.5)'
                                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                                '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.08)'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center">
                                                        <HomeIcon sx={{ mr: 1, fontSize: 18, color: '#6ee7b7' }} />
                                                        <Typography color="#ffffff" fontWeight="500">
                                                            {plot.plot_no}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="caption" color="#94a3b8">
                                                            {getStreetName(plot.street_id)}
                                                        </Typography>
                                                        <br />
                                                        <Chip
                                                            label={plot.plot_type}
                                                            size="small"
                                                            sx={{
                                                                background: plot.plot_type === 'Flats'
                                                                    ? 'rgba(59, 130, 246, 0.2)'
                                                                    : 'rgba(245, 158, 11, 0.2)',
                                                                color: plot.plot_type === 'Flats' ? '#93c5fd' : '#fcd34d',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Flats Management */}
                <Grid item xs={12} md={8}>
                    {selectedPlot ? (
                        <motion.div
                            key={selectedPlot.plot_id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px'
                            }}>
                                <CardContent>
                                    {/* Header */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                        <Box>
                                            <Typography variant="h6" color="#ffffff" display="flex" alignItems="center">
                                                <ApartmentIcon sx={{ mr: 1, color: '#10b981' }} />
                                                Flats in {selectedPlot.plot_no}
                                            </Typography>
                                            <Typography variant="body2" color="#94a3b8">
                                                {getStreetName(selectedPlot.street_id)} • {selectedPlot.plot_type} Type
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Add Single Flat">
                                                <Button
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => setDialogOpen(true)}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }
                                                    }}
                                                >
                                                    Add Flat
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Add Multiple Flats">
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<AddHomeIcon />}
                                                    onClick={() => setBulkDialogOpen(true)}
                                                    sx={{
                                                        borderColor: '#3b82f6',
                                                        color: '#3b82f6',
                                                        '&:hover': {
                                                            borderColor: '#2563eb',
                                                            background: 'rgba(59, 130, 246, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    Bulk Add
                                                </Button>
                                            </Tooltip>
                                        </Stack>
                                    </Box>

                                    {/* Flats Table */}
                                    {flats.length > 0 ? (
                                        <TableContainer component={Paper} sx={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                                            Flat Number
                                                        </TableCell>
                                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                                            EB Card
                                                        </TableCell>
                                                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                                            Actions
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {flats.map((flat) => (
                                                        <motion.tr
                                                            key={flat.flat_id}
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
                                                                <Box display="flex" alignItems="center">
                                                                    <HomeIcon sx={{ mr: 1, color: '#6ee7b7', fontSize: 18 }} />
                                                                    {flat.flat_no}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#e2e8f0' }}>
                                                                <Box display="flex" alignItems="center">
                                                                    <ElectricBoltIcon sx={{ mr: 1, color: '#fbbf24', fontSize: 18 }} />
                                                                    {flat.eb_card || 'Not Set'}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box display="flex" gap={1}>
                                                                    <Tooltip title="Edit Flat">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => {
                                                                                setEditingFlat(flat);
                                                                                setEditDialogOpen(true);
                                                                            }}
                                                                            sx={{
                                                                                color: '#3b82f6',
                                                                                '&:hover': { background: 'rgba(59, 130, 246, 0.1)' }
                                                                            }}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Flat">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleDeleteFlat(flat.flat_id)}
                                                                            sx={{
                                                                                color: '#ef4444',
                                                                                '&:hover': { background: 'rgba(239, 68, 68, 0.1)' }
                                                                            }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
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
                                            py={6}
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                            }}
                                        >
                                            <ApartmentIcon sx={{ fontSize: 64, color: '#475569', mb: 2 }} />
                                            <Typography variant="h6" color="#94a3b8" gutterBottom>
                                                No Flats Found
                                            </Typography>
                                            <Typography variant="body2" color="#64748b" textAlign="center" mb={3}>
                                                This plot doesn't have any flats yet. Add some flats to get started.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => setDialogOpen(true)}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                                    '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }
                                                }}
                                            >
                                                Add First Flat
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Box textAlign="center">
                                <LocationCityIcon sx={{ fontSize: 64, color: '#475569', mb: 2 }} />
                                <Typography variant="h6" color="#94a3b8" gutterBottom>
                                    Select a Plot
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Choose a plot from the left panel to manage its flats
                                </Typography>
                            </Box>
                        </Card>
                    )}
                </Grid>
            </Grid>

            {/* Add Single Flat Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
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
                    <AddIcon sx={{ mr: 1, color: '#10b981' }} />
                    Add New Flat
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Flat Number"
                            value={newFlat.flat_no}
                            onChange={(e) => setNewFlat({ ...newFlat, flat_no: e.target.value })}
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
                            label="EB Card Number (Optional)"
                            value={newFlat.eb_card}
                            onChange={(e) => setNewFlat({ ...newFlat, eb_card: e.target.value })}
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
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddFlat}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }
                        }}
                    >
                        Add Flat
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Add Dialog */}
            <Dialog
                open={bulkDialogOpen}
                onClose={() => setBulkDialogOpen(false)}
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
                    <AddHomeIcon sx={{ mr: 1, color: '#3b82f6' }} />
                    Bulk Add Flats
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" color="#94a3b8" gutterBottom>
                            Enter one flat per line. Format: FlatNumber,EBCard (EB Card is optional)
                        </Typography>
                        <Typography variant="caption" color="#64748b" gutterBottom display="block" sx={{ mb: 2 }}>
                            Examples: F1,EB001 or F1 or 101,EB123
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            label="Flat Details (one per line)"
                            placeholder="F1,EB001
F2,EB002
F3
F4,EB004"
                            value={bulkFlats}
                            onChange={(e) => setBulkFlats(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#ffffff',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                },
                                '& .MuiInputLabel-root': { color: '#94a3b8' }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setBulkDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBulkAdd}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            '&:hover': { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }
                        }}
                    >
                        Add Flats
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Flat Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
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
                    <EditIcon sx={{ mr: 1, color: '#3b82f6' }} />
                    Edit Flat
                </DialogTitle>
                <DialogContent>
                    {editingFlat && (
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Flat Number"
                                value={editingFlat.flat_no}
                                onChange={(e) => setEditingFlat({ ...editingFlat, flat_no: e.target.value })}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#ffffff',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="EB Card Number (Optional)"
                                value={editingFlat.eb_card || ''}
                                onChange={(e) => setEditingFlat({ ...editingFlat, eb_card: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#ffffff',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditFlat}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            '&:hover': { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }
                        }}
                    >
                        Update Flat
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FlatsManagement;