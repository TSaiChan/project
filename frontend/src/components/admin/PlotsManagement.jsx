// src/components/admin/PlotsManagement.jsx - FIXED
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Paper, Grid
} from '@mui/material';
import { Edit, Delete, Add, HomeWork } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const PlotsManagement = () => {
  console.log('🏘️ PlotsManagement component rendered'); // Debug log

  const org_id = 1;
  const [plots, setPlots] = useState([]);
  const [streets, setStreets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editPlot, setEditPlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    street_id: '',
    plot_type: 'Individual',
    plot_no: ''
  });

  useEffect(() => {
    fetchPlots();
    fetchStreets();
  }, []);

  const fetchPlots = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/admin/plots/${org_id}`);
      setPlots(res.data);
    } catch (err) {
      console.error('Fetch plots failed', err);
      // Set dummy data for testing
      setPlots([
        { plot_id: 1, street_name: 'Main Street', plot_no: 'P-101', plot_type: 'Individual' },
        { plot_id: 2, street_name: 'Garden Lane', plot_no: 'P-102', plot_type: 'Flats' },
        { plot_id: 3, street_name: 'Park Avenue', plot_no: 'P-201', plot_type: 'Individual' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreets = async () => {
    try {
      const res = await axios.get(`/api/admin/streets/${org_id}`);
      setStreets(res.data);
    } catch (err) {
      console.error('Fetch streets failed', err);
      // Set dummy data for testing
      setStreets([
        { street_id: 1, street_name: 'Main Street' },
        { street_id: 2, street_name: 'Garden Lane' },
        { street_id: 3, street_name: 'Park Avenue' }
      ]);
    }
  };

  const handleOpen = (plot = null) => {
    if (plot) {
      setEditPlot(plot);
      setForm({
        street_id: plot.street_id,
        plot_type: plot.plot_type,
        plot_no: plot.plot_no
      });
    } else {
      setEditPlot(null);
      setForm({ street_id: '', plot_type: 'Individual', plot_no: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditPlot(null);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (editPlot) {
        await axios.put(`/api/admin/plots/${editPlot.plot_id}`, form);
      } else {
        await axios.post(`/api/admin/plots`, { ...form, org_id });
      }
      fetchPlots();
      handleClose();
    } catch (err) {
      console.error('Save plot error:', err);
      alert('Error saving plot. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plot?')) return;
    try {
      await axios.delete(`/api/admin/plots/${id}`);
      fetchPlots();
    } catch (err) {
      console.error('Delete plot error:', err);
      alert('Error deleting plot. Please try again.');
    }
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
            <HomeWork sx={{ color: '#10b981' }} />
            Plots Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Oversee and manage plot assignments
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669, #047857)',
              transform: 'translateY(-2px)',
            },
            borderRadius: '12px',
            px: 3,
            py: 1
          }}
        >
          Add Plot
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                {plots.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Total Plots
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                {plots.filter(p => p.plot_type === 'Individual').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Individual Plots
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                {plots.filter(p => p.plot_type === 'Flats').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Flat Complexes
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* Plots Table */}
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
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Street</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Plot No</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {[...Array(5)].map((_, cellIndex) => (
                      <TableCell key={cellIndex} sx={{ color: '#cbd5e1' }}>
                        Loading...
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : plots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                    <HomeWork sx={{ fontSize: '4rem', color: '#94a3b8', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 1 }}>
                      No Plots Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Start by adding plot information for your community
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                plots.map((plot, i) => (
                  <TableRow
                    key={plot.plot_id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)'
                      }
                    }}
                  >
                    <TableCell sx={{ color: '#cbd5e1' }}>{i + 1}</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                      {plot.street_name}
                    </TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>
                      {plot.plot_no}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: plot.plot_type === 'Individual' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                          color: plot.plot_type === 'Individual' ? '#60a5fa' : '#a78bfa',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {plot.plot_type}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpen(plot)}
                        sx={{
                          color: '#60a5fa',
                          '&:hover': {
                            background: 'rgba(59, 130, 246, 0.15)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(plot.plot_id)}
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>

      {/* Add/Edit Plot Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
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
        <DialogTitle sx={{ color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HomeWork sx={{ color: '#10b981' }} />
            {editPlot ? 'Edit Plot' : 'Add New Plot'}
          </div>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Street</InputLabel>
            <Select
              name="street_id"
              value={form.street_id}
              onChange={handleChange}
              label="Street"
              required
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                '& .MuiSelect-select': { color: '#e2e8f0' }
              }}
            >
              {streets.map((s) => (
                <MenuItem key={s.street_id} value={s.street_id}>
                  {s.street_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="plot_no"
            label="Plot Number"
            fullWidth
            value={form.plot_no}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#10b981' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputBase-input': { color: '#e2e8f0' }
            }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Plot Type</InputLabel>
            <Select
              name="plot_type"
              value={form.plot_type}
              onChange={handleChange}
              label="Plot Type"
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                '& .MuiSelect-select': { color: '#e2e8f0' }
              }}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Flats">Flats</MenuItem>
            </Select>
          </FormControl>
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
            disabled={!form.street_id || !form.plot_no}
            sx={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669, #047857)',
              }
            }}
          >
            {editPlot ? 'Update' : 'Add'} Plot
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default PlotsManagement;