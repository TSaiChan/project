// src/components/admin/StreetsManagement.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Chip, Tooltip
} from '@mui/material';
import {
  Edit, Delete, Add, LocationCity, Visibility,
  TrendingUp, Home
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './AdminPages.css';

const StreetsManagement = () => {
  const org_id = 1;
  const [streets, setStreets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editStreet, setEditStreet] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch streets
  const fetchStreets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/admin/streets/${org_id}`);
      setStreets(res.data);
    } catch (err) {
      console.error('Error fetching streets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [org_id]);

  useEffect(() => {
    fetchStreets();
  }, [fetchStreets]);

  // Add or update street
  const handleSave = async () => {
    if (!streetName.trim()) {
      alert('Please enter a street name');
      return;
    }

    try {
      if (editStreet) {
        await axios.put(`/api/admin/streets/${editStreet.street_id}`, {
          street_name: streetName.trim()
        });
      } else {
        await axios.post('/api/admin/streets', {
          org_id,
          street_name: streetName.trim()
        });
      }
      fetchStreets();
      handleClose();
    } catch (err) {
      console.error('Error saving street:', err);
      alert('Error saving street. Please try again.');
    }
  };

  const handleEdit = (street) => {
    setEditStreet(street);
    setStreetName(street.street_name);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this street? This action cannot be undone.')) return;

    try {
      await axios.delete(`/api/admin/streets/${id}`);
      fetchStreets();
    } catch (err) {
      console.error('Error deleting street:', err);
      alert('Error deleting street. Please try again.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStreetName('');
    setEditStreet(null);
  };

  const handleAddNew = () => {
    setEditStreet(null);
    setStreetName('');
    setOpen(true);
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
            <LocationCity sx={{ mr: 1, verticalAlign: 'middle' }} />
            Streets Management
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Manage and organize community streets
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          className="admin-add-btn"
        >
          Add Street
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <motion.div
          className="report-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LocationCity sx={{ color: '#3b82f6', fontSize: '2rem' }} />
            <div>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {streets.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Total Streets
              </Typography>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="report-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Home sx={{ color: '#10b981', fontSize: '2rem' }} />
            <div>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {streets.reduce((total, street) => total + (street.plot_count || 0), 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Total Plots
              </Typography>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="report-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp sx={{ color: '#f59e0b', fontSize: '2rem' }} />
            <div>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {streets.length > 0 ? Math.round(streets.reduce((total, street) => total + (street.plot_count || 0), 0) / streets.length) : 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Avg Plots/Street
              </Typography>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Streets Table */}
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
              <TableCell>Street Name</TableCell>
              <TableCell>Plots Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="admin-table-body">
            <AnimatePresence>
              {isLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell><div className="loading-skeleton" /></TableCell>
                    <TableCell><div className="loading-skeleton" /></TableCell>
                    <TableCell><div className="loading-skeleton" /></TableCell>
                    <TableCell><div className="loading-skeleton" /></TableCell>
                    <TableCell><div className="loading-skeleton" /></TableCell>
                  </TableRow>
                ))
              ) : streets.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="empty-state">
                      <LocationCity className="empty-state-icon" />
                      <Typography variant="h6" className="empty-state-title">
                        No Streets Found
                      </Typography>
                      <Typography variant="body2" className="empty-state-subtitle">
                        Start by adding your first street to organize your community
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                streets.map((street, index) => (
                  <motion.tr
                    key={street.street_id}
                    component={TableRow}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LocationCity sx={{ color: '#3b82f6', fontSize: '1.2rem' }} />
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                          {street.street_name}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${street.plot_count || 0} plots`}
                        className="status-chip"
                        style={{
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          borderColor: 'rgba(59, 130, 246, 0.3)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Active"
                        className="status-chip success"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details" arrow>
                        <IconButton className="admin-action-btn admin-special-btn">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Street" arrow>
                        <IconButton
                          onClick={() => handleEdit(street)}
                          className="admin-action-btn admin-edit-btn"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Street" arrow>
                        <IconButton
                          onClick={() => handleDelete(street.street_id)}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className="admin-dialog"
      >
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LocationCity sx={{ color: '#3b82f6' }} />
            {editStreet ? 'Edit Street' : 'Add New Street'}
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
                Street Information
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Street Name"
                fullWidth
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name (e.g., Main Street, Oak Avenue)"
                helperText="Choose a unique and descriptive name for the street"
                InputProps={{
                  startAdornment: <LocationCity sx={{ color: '#94a3b8', mr: 1 }} />
                }}
              />
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
            disabled={!streetName.trim()}
          >
            {editStreet ? 'Update Street' : 'Add Street'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StreetsManagement;