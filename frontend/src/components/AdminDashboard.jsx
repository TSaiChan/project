// components/AdminDashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';

import StreetsManagement from './admin/StreetsManagement';
import PlotsManagement from './admin/PlotsManagement';
import FlatsManagement from './admin/FlatsManagement';
import ResidentsManagement from './admin/ResidentsManagement';
import PaymentsManagement from './admin/PaymentsManagement';
import MaintenanceRequests from './admin/MaintenanceRequests';
import ReportsAnalytics from './admin/ReportsAnalytics';
import SendNotification from './admin/SendNotification';

// Default Dashboard Component
const Dashboard = () => (
    <div style={{ padding: '24px', width: '100%' }}>
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '2rem auto'
        }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '4rem' }}>🏠</span>
            </div>
            <h2 style={{
                color: '#ffffff',
                marginBottom: '1rem',
                fontSize: '2.5rem',
                fontWeight: '800'
            }}>
                Welcome to GCMS Admin
            </h2>
            <p style={{
                color: '#cbd5e1',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
            }}>
                Manage your community with ease. Select a module from the sidebar to get started.
            </p>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
            }}>
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛣️</div>
                    <div style={{ color: '#93c5fd', fontSize: '0.9rem' }}>Streets</div>
                </div>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏘️</div>
                    <div style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>Plots</div>
                </div>
                <div style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(20, 184, 166, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                    <div style={{ color: '#5eead4', fontSize: '0.9rem' }}>Flats</div>
                </div>
                <div style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                    <div style={{ color: '#c4b5fd', fontSize: '0.9rem' }}>Residents</div>
                </div>
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
                    <div style={{ color: '#fcd34d', fontSize: '0.9rem' }}>Payments</div>
                </div>
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧</div>
                    <div style={{ color: '#fcd34d', fontSize: '0.9rem' }}>Maintenance</div>
                </div>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                {/* Default dashboard route */}
                <Route index element={<Dashboard />} />

                {/* Admin sub-routes */}
                <Route path="streets" element={<StreetsManagement />} />
                <Route path="plots" element={<PlotsManagement />} />
                <Route path="flats" element={<FlatsManagement />} />
                <Route path="residents" element={<ResidentsManagement />} />
                <Route path="payments" element={<PaymentsManagement />} />
                <Route path="maintenance-requests" element={<MaintenanceRequests />} />
                <Route path="reports" element={<ReportsAnalytics />} />
                <Route path="send-notifications" element={<SendNotification />} />
            </Route>
        </Routes>
    );
};

export default AdminDashboard;