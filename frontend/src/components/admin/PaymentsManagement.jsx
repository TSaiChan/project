// src/components/admin/PaymentsManagement.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Select, MenuItem, FormControl, InputLabel, Chip, Tooltip,
  Grid, Paper
} from '@mui/material';
import {
  Add, Delete, Payment, TrendingUp, AccessTime, CheckCircle,
  Person, Home, CalendarToday
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

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
      pending: { color: '#f59e0b', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' },
      paid: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
      overdue: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
          fontWeight: 600
        }}
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
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Page Header */}
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem 2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <Typography variant="h4" sx={{
            color: '#ffffff',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Payment sx={{ color: '#3b82f6' }} />
            Payments Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Track and manage community payments
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
              transform: 'translateY(-2px)',
            },
            borderRadius: '12px',
            px: 3,
            py: 1
          }}
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
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
              }
            }}>
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
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
              }
            }}>
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
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
              }
            }}>
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
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
              }
            }}>
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
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Paper sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead sx={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              <TableRow>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Resident</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Plot</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {[...Array(8)].map((_, cellIndex) => (
                      <TableCell key={cellIndex} sx={{ color: '#cbd5e1' }}>
                        Loading...
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
                    <Payment sx={{ fontSize: '4rem', color: '#94a3b8', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 1 }}>
                      No Payments Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Start by adding payment records for residents
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((pay, i) => (
                  <TableRow
                    key={pay.payment_id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)'
                      }
                    }}
                  >
                    <TableCell sx={{ color: '#cbd5e1' }}>{i + 1}</TableCell>
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
                          sx={{
                            color: '#f87171',
                            '&:hover': {
                              background: 'rgba(239, 68, 68, 0.15)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>

      {/* Add Payment Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
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
        <DialogTitle sx={{ color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Payment sx={{ color: '#3b82f6' }} />
            Add New Payment
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Resident</InputLabel>
                <Select
                  name="resident_id"
                  value={form.resident_id}
                  onChange={handleChange}
                  label="Resident"
                  required
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '& .MuiSelect-select': { color: '#e2e8f0' }
                  }}
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
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Plot</InputLabel>
                <Select
                  name="plot_id"
                  value={form.plot_id}
                  onChange={handleChange}
                  label="Plot"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '& .MuiSelect-select': { color: '#e2e8f0' }
                  }}
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
                type="number"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiInputBase-input': { color: '#e2e8f0' }
                }}
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
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiInputBase-input': { color: '#e2e8f0' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            sx={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.resident_id || !form.amount || !form.due_date}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
              }
            }}
          >
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentsManagement;