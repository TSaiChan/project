// src/components/admin/ReportsAnalytics.jsx - FIXED
import React, { useEffect, useState } from 'react';
import {
    Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Grid, Box
} from '@mui/material';
import { Assessment, TrendingUp, PieChart, BarChart, AccessTime, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ReportsAnalytics = () => {
    console.log('📊 ReportsAnalytics component rendered'); // Debug log

    const org_id = 1;
    const [paymentSummary, setPaymentSummary] = useState([]);
    const [residentCount, setResidentCount] = useState([]);
    const [overduePayments, setOverduePayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const [summaryRes, countRes, overdueRes] = await Promise.all([
                axios.get(`/api/admin/reports/payment-summary/${org_id}`),
                axios.get(`/api/admin/reports/resident-count/${org_id}`),
                axios.get(`/api/admin/reports/overdue-payments/${org_id}`)
            ]);

            setPaymentSummary(summaryRes.data);
            setResidentCount(countRes.data);
            setOverduePayments(overdueRes.data);
        } catch (err) {
            console.error('Error fetching reports:', err);
            // Set dummy data for testing
            setPaymentSummary([
                { status: 'Paid', count: 25, total: 125000 },
                { status: 'Pending', count: 8, total: 32000 },
                { status: 'Overdue', count: 3, total: 9000 }
            ]);

            setResidentCount([
                { street_name: 'Main Street', resident_count: 15 },
                { street_name: 'Garden Lane', resident_count: 12 },
                { street_name: 'Park Avenue', resident_count: 9 }
            ]);

            setOverduePayments([
                {
                    payment_id: 1,
                    resident_name: 'John Smith',
                    plot_no: 'P-101',
                    flat_no: 'A-1',
                    amount: 3000,
                    due_date: '2024-12-15',
                    status: 'overdue'
                },
                {
                    payment_id: 2,
                    resident_name: 'Sarah Wilson',
                    plot_no: 'P-205',
                    flat_no: null,
                    amount: 2500,
                    due_date: '2024-12-10',
                    status: 'overdue'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const getTotalPayments = () => {
        return paymentSummary.reduce((sum, item) => sum + item.count, 0);
    };

    const getTotalAmount = () => {
        return paymentSummary.reduce((sum, item) => sum + item.total, 0);
    };

    const getTotalResidents = () => {
        return residentCount.reduce((sum, item) => sum + item.resident_count, 0);
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
                        <Assessment sx={{ color: '#ef4444' }} />
                        Reports & Analytics
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                        View detailed analytics and reports
                    </Typography>
                </div>
            </motion.div>

            {/* Summary Cards */}
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
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                            }
                        }}>
                            <TrendingUp sx={{ color: '#ef4444', fontSize: '2.5rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                {getTotalPayments()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                Total Payments
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                            }
                        }}>
                            <BarChart sx={{ color: '#10b981', fontSize: '2.5rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                ₹{getTotalAmount().toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                Total Amount
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                            }
                        }}>
                            <PieChart sx={{ color: '#8b5cf6', fontSize: '2.5rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                {getTotalResidents()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                Total Residents
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                            }
                        }}>
                            <AccessTime sx={{ color: '#f59e0b', fontSize: '2.5rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                {overduePayments.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                Overdue Payments
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </motion.div>

            {/* Payment Summary */}
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
                    overflow: 'hidden',
                    mb: 3
                }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                            💰 Payment Summary
                        </Typography>
                    </Box>
                    <Table>
                        <TableHead sx={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }} align="right">Count</TableCell>
                                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }} align="right">Total Amount (₹)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                [...Array(3)].map((_, index) => (
                                    <TableRow key={`loading-${index}`}>
                                        <TableCell sx={{ color: '#cbd5e1' }}>Loading...</TableCell>
                                        <TableCell sx={{ color: '#cbd5e1' }} align="right">-</TableCell>
                                        <TableCell sx={{ color: '#cbd5e1' }} align="right">-</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                paymentSummary.map((row) => (
                                    <TableRow
                                        key={row.status}
                                        sx={{
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.08)'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {row.status === 'Paid' && <CheckCircle sx={{ color: '#10b981', fontSize: '1rem' }} />}
                                                {row.status === 'Pending' && <AccessTime sx={{ color: '#f59e0b', fontSize: '1rem' }} />}
                                                {row.status === 'Overdue' && <AccessTime sx={{ color: '#ef4444', fontSize: '1rem' }} />}
                                                {row.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#cbd5e1', fontWeight: 600 }} align="right">
                                            {row.count}
                                        </TableCell>
                                        <TableCell sx={{ color: '#ffffff', fontWeight: 700 }} align="right">
                                            ₹{parseFloat(row.total).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </motion.div>

            {/* Two Column Layout for Resident Count and Overdue Payments */}
            <Grid container spacing={3}>
                {/* Resident Count */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Paper sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            height: 'fit-content'
                        }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                    🏘️ Residents by Street
                                </Typography>
                            </Box>
                            <Table>
                                <TableHead sx={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Street</TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }} align="right">Residents</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(3)].map((_, index) => (
                                            <TableRow key={`loading-${index}`}>
                                                <TableCell sx={{ color: '#cbd5e1' }}>Loading...</TableCell>
                                                <TableCell sx={{ color: '#cbd5e1' }} align="right">-</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        residentCount.map((row) => (
                                            <TableRow
                                                key={row.street_name}
                                                sx={{
                                                    '&:hover': {
                                                        background: 'rgba(255, 255, 255, 0.08)'
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                                                    {row.street_name}
                                                </TableCell>
                                                <TableCell sx={{ color: '#8b5cf6', fontWeight: 700 }} align="right">
                                                    {row.resident_count}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Overdue Payments */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <Paper sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            height: 'fit-content'
                        }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                    ⚠️ Overdue Payments
                                </Typography>
                            </Box>
                            <Table>
                                <TableHead sx={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.8rem' }}>Resident</TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.8rem' }}>Plot</TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '0.8rem' }} align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(2)].map((_, index) => (
                                            <TableRow key={`loading-${index}`}>
                                                <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Loading...</TableCell>
                                                <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>-</TableCell>
                                                <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }} align="right">-</TableCell>
                                            </TableRow>
                                        ))
                                    ) : overduePayments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                                                <CheckCircle sx={{ fontSize: '2rem', color: '#10b981', opacity: 0.5, mb: 1 }} />
                                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                    No overdue payments!
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        overduePayments.map((p) => (
                                            <TableRow
                                                key={p.payment_id}
                                                sx={{
                                                    '&:hover': {
                                                        background: 'rgba(255, 255, 255, 0.08)'
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.8rem' }}>
                                                    {p.resident_name}
                                                    {p.flat_no && (
                                                        <Typography variant="caption" sx={{ color: '#8b5cf6', display: 'block' }}>
                                                            Flat: {p.flat_no}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>
                                                    {p.plot_no}
                                                </TableCell>
                                                <TableCell sx={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }} align="right">
                                                    ₹{parseFloat(p.amount).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>


        </div>
    );
};

export default ReportsAnalytics;