// src/components/admin/ResidentsManagement.jsx - FIXED
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Select, MenuItem, FormControl, InputLabel, Paper,
  Checkbox, FormControlLabel, Divider, Chip, Grid
} from '@mui/material';
import { Add, Edit, Delete, Key, VpnKey, People } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ResidentsManagement = () => {
  console.log('👥 ResidentsManagement component rendered'); // Debug log

  const org_id = 1;
  const [residents, setResidents] = useState([]);
  const [plots, setPlots] = useState([]);
  const [flats, setFlats] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editResident, setEditResident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    contact_number: '',
    email: '',
    id_proof: '',
    plot_id: '',
    flat_id: '',
    // Login credentials
    create_login: false,
    user_name: '',
    password: '',
    user_type: 'owner'
  });

  useEffect(() => {
    fetchResidents();
    fetchPlots();
  }, []);

  const fetchResidents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/admin/residents/${org_id}`);
      setResidents(res.data);
    } catch (err) {
      console.error('Error fetching residents:', err);
      // Set dummy data for testing
      setResidents([
        {
          resident_id: 1,
          name: 'John Doe',
          contact_number: '+91 9876543210',
          email: 'john@example.com',
          plot_no: 'P-101',
          flat_no: 'A-1',
          has_login: true,
          user_name: 'johndoe'
        },
        {
          resident_id: 2,
          name: 'Jane Smith',
          contact_number: '+91 8765432109',
          email: 'jane@example.com',
          plot_no: 'P-102',
          flat_no: null,
          has_login: false,
          user_name: null
        },
        {
          resident_id: 3,
          name: 'Mike Johnson',
          contact_number: '+91 7654321098',
          email: 'mike@example.com',
          plot_no: 'P-201',
          flat_no: 'B-2',
          has_login: true,
          user_name: 'mikej'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlots = async () => {
    try {
      const res = await axios.get(`/api/admin/plots/${org_id}`);
      setPlots(res.data);
    } catch (err) {
      console.error('Error fetching plots:', err);
      // Set dummy data for testing
      setPlots([
        { plot_id: 1, plot_no: 'P-101' },
        { plot_id: 2, plot_no: 'P-102' },
        { plot_id: 3, plot_no: 'P-201' }
      ]);
    }
  };

  const fetchFlats = async (plotId) => {
    try {
      const res = await axios.get(`/api/admin/flats/${plotId}`);
      setFlats(res.data);
    } catch (err) {
      console.error('Error fetching flats:', err);
      // Set dummy data for testing
      setFlats([
        { flat_id: 1, flat_no: 'A-1' },
        { flat_id: 2, flat_no: 'A-2' },
        { flat_id: 3, flat_no: 'B-1' },
        { flat_id: 4, flat_no: 'B-2' }
      ]);
    }
  };

  const handleOpen = (resident = null) => {
    if (resident) {
      setEditResident(resident);
      setForm({
        name: resident.name,
        contact_number: resident.contact_number || '',
        email: resident.email || '',
        id_proof: resident.id_proof || '',
        plot_id: resident.plot_id,
        flat_id: resident.flat_id || '',
        create_login: false,
        user_name: resident.user_name || '',
        password: '',
        user_type: resident.user_type || 'owner'
      });
      fetchFlats(resident.plot_id);
    } else {
      setEditResident(null);
      setForm({
        name: '',
        contact_number: '',
        email: '',
        id_proof: '',
        plot_id: '',
        flat_id: '',
        create_login: false,
        user_name: '',
        password: '',
        user_type: 'owner'
      });
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditResident(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'plot_id') {
      fetchFlats(value);
      setForm(prev => ({ ...prev, flat_id: '' }));
    }
  };

  const handleSave = async () => {
    try {
      if (editResident) {
        await axios.put(`/api/admin/residents/${editResident.resident_id}`, form);
      } else {
        await axios.post(`/api/admin/residents`, form);
      }
      fetchResidents();
      handleClose();
    } catch (err) {
      console.error('Error saving resident:', err);
      alert('Error saving resident: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resident?')) return;
    try {
      await axios.delete(`/api/admin/residents/${id}`);
      fetchResidents();
    } catch (err) {
      console.error('Error deleting resident:', err);
      alert('Error deleting resident. Please try again.');
    }
  };

  const handleResetPassword = async (residentId) => {
    const newPassword = prompt('Enter new password for this resident:');
    if (!newPassword) return;

    try {
      await axios.put(`/api/admin/residents/${residentId}/reset-password`, {
        password: newPassword
      });
      alert('Password updated successfully!');
    } catch (err) {
      console.error('Error resetting password:', err);
      alert('Error resetting password: ' + (err.response?.data?.message || err.message));
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
            <People sx={{ color: '#8b5cf6' }} />
            Residents Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Manage resident profiles and information
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              transform: 'translateY(-2px)',
            },
            borderRadius: '12px',
            px: 3,
            py: 1
          }}
        >
          Add Resident
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
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                {residents.length}
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
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                {residents.filter(r => r.has_login).length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                With Login
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
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                {residents.filter(r => !r.has_login).length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Without Login
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
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                {residents.filter(r => r.flat_no).length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                In Flats
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* Residents Table */}
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
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Plot</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Flat</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }}>Login Status</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {[...Array(8)].map((_, cellIndex) => (
                      <TableCell key={cellIndex} sx={{ color: '#cbd5e1' }}>
                        Loading...
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : residents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
                    <People sx={{ fontSize: '4rem', color: '#94a3b8', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 1 }}>
                      No Residents Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Start by adding resident information
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                residents.map((r, index) => (
                  <TableRow
                    key={r.resident_id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)'
                      }
                    }}
                  >
                    <TableCell sx={{ color: '#cbd5e1' }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                      {r.name}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>
                      {r.contact_number}
                    </TableCell>
                    <TableCell sx={{ color: '#60a5fa' }}>
                      {r.email}
                    </TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>
                      {r.plot_no}
                    </TableCell>
                    <TableCell sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                      {r.flat_no || '-'}
                    </TableCell>
                    <TableCell>
                      {r.has_login ? (
                        <Chip
                          label={`@${r.user_name}`}
                          size="small"
                          icon={<VpnKey />}
                          sx={{
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: '#6ee7b7',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}
                        />
                      ) : (
                        <Chip
                          label="No Login"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(156, 163, 175, 0.2)',
                            color: '#d1d5db',
                            border: '1px solid rgba(156, 163, 175, 0.3)'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpen(r)}
                        sx={{
                          color: '#60a5fa',
                          '&:hover': {
                            background: 'rgba(59, 130, 246, 0.15)',
                            transform: 'scale(1.1)'
                          }
                        }}
                        title="Edit"
                      >
                        <Edit />
                      </IconButton>
                      {r.has_login && (
                        <IconButton
                          onClick={() => handleResetPassword(r.resident_id)}
                          sx={{
                            color: '#a78bfa',
                            '&:hover': {
                              background: 'rgba(139, 92, 246, 0.15)',
                              transform: 'scale(1.1)'
                            }
                          }}
                          title="Reset Password"
                        >
                          <Key />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDelete(r.resident_id)}
                        sx={{
                          color: '#f87171',
                          '&:hover': {
                            background: 'rgba(239, 68, 68, 0.15)',
                            transform: 'scale(1.1)'
                          }
                        }}
                        title="Delete"
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

      {/* Add/Edit Resident Dialog */}
      <Dialog
        open={dialogOpen}
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
            <People sx={{ color: '#8b5cf6' }} />
            {editResident ? 'Edit Resident' : 'Add New Resident'}
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 1, mb: 2, color: '#e2e8f0' }}>
            Basic Information
          </Typography>

          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputBase-input': { color: '#e2e8f0' }
            }}
          />
          <TextField
            name="contact_number"
            label="Contact Number"
            value={form.contact_number}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputBase-input': { color: '#e2e8f0' }
            }}
          />
          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputBase-input': { color: '#e2e8f0' }
            }}
          />
          <TextField
            name="id_proof"
            label="ID Proof"
            value={form.id_proof}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputBase-input': { color: '#e2e8f0' }
            }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Plot</InputLabel>
            <Select
              name="plot_id"
              value={form.plot_id}
              onChange={handleChange}
              label="Plot"
              required
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8b5cf6' },
                '& .MuiSelect-select': { color: '#e2e8f0' }
              }}
            >
              {plots.map(p => (
                <MenuItem key={p.plot_id} value={p.plot_id}>{p.plot_no}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Flat</InputLabel>
            <Select
              name="flat_id"
              value={form.flat_id || ''}
              onChange={handleChange}
              label="Flat"
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8b5cf6' },
                '& .MuiSelect-select': { color: '#e2e8f0' }
              }}
            >
              <MenuItem value="">(None)</MenuItem>
              {flats.map(f => (
                <MenuItem key={f.flat_id} value={f.flat_id}>{f.flat_no}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Typography variant="h6" sx={{ mb: 2, color: '#e2e8f0' }}>
            Login Credentials
          </Typography>

          {!editResident ? (
            <FormControlLabel
              control={
                <Checkbox
                  name="create_login"
                  checked={form.create_login}
                  onChange={handleChange}
                  sx={{ color: '#8b5cf6' }}
                />
              }
              label={
                <span style={{ color: '#cbd5e1' }}>
                  Create login account for this resident
                </span>
              }
            />
          ) : (
            <Box>
              {editResident.has_login ? (
                <Typography sx={{ mb: 1, color: '#6ee7b7' }}>
                  ✓ Login account exists: @{editResident.user_name}
                </Typography>
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      name="create_login"
                      checked={form.create_login}
                      onChange={handleChange}
                      sx={{ color: '#8b5cf6' }}
                    />
                  }
                  label={
                    <span style={{ color: '#cbd5e1' }}>
                      Create login account for this resident
                    </span>
                  }
                />
              )}
            </Box>
          )}

          {(form.create_login || (editResident && !editResident.has_login && form.create_login)) && (
            <Box sx={{ ml: 2, mt: 2 }}>
              <TextField
                name="user_name"
                label="Username"
                value={form.user_name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required={form.create_login}
                helperText="Username for resident login"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiInputBase-input': { color: '#e2e8f0' },
                  '& .MuiFormHelperText-root': { color: '#94a3b8' }
                }}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required={form.create_login}
                helperText="Password for resident login"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiInputBase-input': { color: '#e2e8f0' },
                  '& .MuiFormHelperText-root': { color: '#94a3b8' }
                }}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel sx={{ color: '#94a3b8' }}>User Type</InputLabel>
                <Select
                  name="user_type"
                  value={form.user_type}
                  onChange={handleChange}
                  label="User Type"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8b5cf6' },
                    '& .MuiSelect-select': { color: '#e2e8f0' }
                  }}
                >
                  <MenuItem value="owner">Owner</MenuItem>
                  <MenuItem value="tenant">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
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
            disabled={!form.name || !form.plot_id}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              }
            }}
          >
            {editResident ? 'Update' : 'Add'} Resident
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default ResidentsManagement;