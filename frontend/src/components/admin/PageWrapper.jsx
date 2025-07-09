// src/components/admin/PaymentsManagement.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    IconButton, Select, MenuItem, FormControl, InputLabel, Chip, Tooltip,
    Grid
} from '@mui/material';
import {
    Add, Delete, Payment, TrendingUp, AccessTime, CheckCircle,
    ErrorOutline, AccountBalance, Person, Home, CalendarToday
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './AdminPages.css';

const PaymentsManagement = () => {
    const org_id = 1;
    const [payments, setPayments] = useState([]);
    const [residents, setResidents] = useState([]);
    const [plots, setPlots] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStats, setPaymentStats] = useState({
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        totalAmount: 0
    });

    const [form, setForm] = useState({
        plot_id: '',
        resident_id: '',
        amount: '',
        payment_type: 'maintenance',
        payment_date: '',
        due_date: '',
        status: 'pending',
        payment_method: 'cash',
        transaction_id: '',
        notes: ''
    });

    const calculateStats = (paymentsData) => {
        const stats = {
            total: paymentsData.length,
            paid: paymentsData.filter(p => p.status === 'paid').length,
            pending: paymentsData.filter(p => p.status === 'pending').length,
            overdue: paymentsData.filter(p => p.status === 'overdue').length,
            totalAmount: paymentsData.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        };
        setPaymentStats(stats);
    };

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/admin/payments/${org_id}`);
            setPayments(res.data);
            calculateStats(res.data);
        } catch (err) {
            console.error('Error fetching payments:', err);
        } finally {
            setIsLoading(false);
        }
    }, [org_id]);

    const fetchResidents = useCallback(async () => {
        try {
            const res = await axios.get(`/api/admin/residents/${org_id}`);
            setResidents(res.data);
        } catch (err) {
            console.error('Error fetching residents:', err);
        }
    }, [org_id]);

    const fetchPlots = useCallback(async () => {
        try {
            const res = await axios.get(`/api/admin/plots/${org_id}`);
            setPlots(res.data);
        } catch (err) {
            console.error('Error fetching plots:', err);
        }
    }, [org_id]);

    useEffect(() => {
        fetchPayments();
        fetchResidents();
        fetchPlots();
    }, [fetchPayments, fetchResidents, fetchPlots]);

    const handleOpen = () => {
        setForm({
            plot_id: '',
            resident_id: '',
            amount: '',
            payment_type: 'maintenance',
            payment_date: new Date().toISOString().split('T')[0],
            due_date: '',
            status: 'pending',
            payment_method: 'cash',
            transaction_id: '',
            notes: ''
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (!form.resident_id || !form.amount || !form.due_date) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await axios.post('/api/admin/payments', form);
            fetchPayments();
            handleClose();
        } catch (err) {
            console.error('Error saving payment:', err);
            alert('Error saving payment. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this payment?')) return;
        try {
            await axios.delete(`/api/admin/payments/${id}`);
            fetchPayments();
        } catch (err) {
            console.error('Error deleting payment:', err);
            alert('Error deleting payment. Please try again.');
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { class: 'pending', icon: <AccessTime /> },
            paid: { class: 'paid', icon: <CheckCircle /> },
            overdue: { class: 'overdue', icon: <ErrorOutline /> }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Chip
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                className={`status-chip ${config.class}`}
                icon={config.icon}
                size="small"
            />
        );
    };

    const getPaymentTypeColor = (type) => {
        const colors = {
            maintenance: '#3b82f6',
            water: '#06b6d4',
            electricity: '#f59e0b',
            other: '#8b5cf6'
        };
        return colors[type] || colors.other;
    };

    return (
        <>
            {/* Page Header */}
            <motion.div
                className="admin-page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div>
                    <Typography variant="h4" className="page-title">
                        <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Payments Management
                    </Typography>
                    <Typography variant="body2" className="page-subtitle">
                        Track and manage community payments
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}
                    className="admin-add-btn"
                >
                    Add Payment
                </Button>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            className="report-card"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Payment sx={{ color: '#3b82f6', fontSize: '2rem' }} />
                                <div>
                                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                        {paymentStats.total}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        Total Payments
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            className="report-card"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle sx={{ color: '#10b981', fontSize: '2rem' }} />
                                <div>
                                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                        {paymentStats.paid}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        Paid
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            className="report-card"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <AccessTime sx={{ color: '#f59e0b', fontSize: '2rem' }} />
                                <div>
                                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                        {paymentStats.pending}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        Pending
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div
                            className="report-card"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <TrendingUp sx={{ color: '#ef4444', fontSize: '2rem' }} />
                                <div>
                                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                        ₹{paymentStats.totalAmount.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        Total Amount
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    </Grid>
                </Grid>
            </motion.div>

            {/* Payments Table */}
            <motion.div
                className="admin-table-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Table className="admin-table">
                    <TableHead className="admin-table-head">
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Resident</TableCell>
                            <TableCell>Plot</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="admin-table-body">
                        <AnimatePresence>
                            {isLoading ? (
                                [...Array(5)].map((_, index) => (
                                    <TableRow key={`loading-${index}`}>
                                        {[...Array(8)].map((_, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                <div className="loading-skeleton" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <div className="empty-state">
                                            <Payment className="empty-state-icon" />
                                            <Typography variant="h6" className="empty-state-title">
                                                No Payments Found
                                            </Typography>
                                            <Typography variant="body2" className="empty-state-subtitle">
                                                Start by adding payment records for residents
                                            </Typography>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.map((pay, i) => (
                                    <motion.tr
                                        key={pay.payment_id}
                                        component={TableRow}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Person sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                                                    {pay.resident_name}
                                                </Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Home sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                                                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                                    {pay.plot_no}
                                                </Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                                ₹{parseFloat(pay.amount).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={pay.payment_type}
                                                size="small"
                                                sx={{
                                                    backgroundColor: `${getPaymentTypeColor(pay.payment_type)}20`,
                                                    color: getPaymentTypeColor(pay.payment_type),
                                                    border: `1px solid ${getPaymentTypeColor(pay.payment_type)}30`,
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{getStatusChip(pay.status)}</TableCell>
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <CalendarToday sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                                                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                                    {pay.due_date}
                                                </Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Delete Payment" arrow>
                                                <IconButton
                                                    onClick={() => handleDelete(pay.payment_id)}
                                                    className="admin-action-btn admin-delete-btn"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </motion.div>

            {/* Add Payment Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                className="admin-dialog"
            >
                <DialogTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Payment sx={{ color: '#3b82f6' }} />
                        Add New Payment
                    </div>
                </DialogTitle>
                <DialogContent className="admin-form-field">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="form-section">
                            <Typography variant="h6" className="form-section-title">
                                Payment Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ my: 1 }}>
                                        <InputLabel>Resident</InputLabel>
                                        <Select
                                            name="resident_id"
                                            value={form.resident_id}
                                            onChange={handleChange}
                                            label="Resident"
                                            required
                                        >
                                            {residents.map((r) => (
                                                <MenuItem key={r.resident_id} value={r.resident_id}>
                                                    {r.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ my: 1 }}>
                                        <InputLabel>Plot</InputLabel>
                                        <Select
                                            name="plot_id"
                                            value={form.plot_id}
                                            onChange={handleChange}
                                            label="Plot"
                                        >
                                            {plots.map((p) => (
                                                <MenuItem key={p.plot_id} value={p.plot_id}>
                                                    {p.plot_no}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="amount"
                                        label="Amount (₹)"
                                        fullWidth
                                        value={form.amount}
                                        onChange={handleChange}
                                        margin="dense"
                                        type="number"
                                        required
                                        InputProps={{
                                            startAdornment: <AccountBalance sx={{ color: '#94a3b8', mr: 1 }} />
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ my: 1 }}>
                                        <InputLabel>Payment Type</InputLabel>
                                        <Select
                                            name="payment_type"
                                            value={form.payment_type}
                                            onChange={handleChange}
                                            label="Payment Type"
                                        >
                                            <MenuItem value="maintenance">Maintenance</MenuItem>
                                            <MenuItem value="water">Water</MenuItem>
                                            <MenuItem value="electricity">Electricity</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="payment_date"
                                        label="Payment Date"
                                        fullWidth
                                        type="date"
                                        value={form.payment_date}
                                        onChange={handleChange}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="due_date"
                                        label="Due Date"
                                        fullWidth
                                        type="date"
                                        value={form.due_date}
                                        onChange={handleChange}
                                        margin="dense"
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ my: 1 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="paid">Paid</MenuItem>
                                            <MenuItem value="overdue">Overdue</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ my: 1 }}>
                                        <InputLabel>Payment Method</InputLabel>
                                        <Select
                                            name="payment_method"
                                            value={form.payment_method}
                                            onChange={handleChange}
                                            label="Payment Method"
                                        >
                                            <MenuItem value="cash">Cash</MenuItem>
                                            <MenuItem value="online">Online</MenuItem>
                                            <MenuItem value="cheque">Cheque</MenuItem>
                                            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="transaction_id"
                                        label="Transaction ID"
                                        fullWidth
                                        value={form.transaction_id}
                                        onChange={handleChange}
                                        margin="dense"
                                        placeholder="Enter transaction ID (if applicable)"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="notes"
                                        label="Notes"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={form.notes}
                                        onChange={handleChange}
                                        margin="dense"
                                        placeholder="Add any additional notes..."
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </motion.div>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        className="admin-dialog-btn admin-cancel-btn"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        className="admin-dialog-btn admin-save-btn"
                        disabled={!form.resident_id || !form.amount || !form.due_date}
                    >
                        Add Payment
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PaymentsManagement;