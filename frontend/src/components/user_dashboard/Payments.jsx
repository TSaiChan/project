import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const user = JSON.parse(sessionStorage.getItem("user"));
    const plotId = user?.plot_id;

    const fetchPayments = useCallback(async () => {
        if (!plotId) return;

        setIsLoading(true);
        try {
            const res = await axios.get(`/api/user/payments/${plotId}`);
            setPayments(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch payments",
                icon: "error",
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                confirmButtonColor: 'var(--error-color)',
            });
        } finally {
            setIsLoading(false);
        }
    }, [plotId]);

    const markAsPaid = async (id) => {
        try {
            await axios.put(`/api/user/payments/${id}/mark-paid`);
            Swal.fire({
                title: "Success!",
                text: "Payment marked as paid",
                icon: "success",
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                confirmButtonColor: 'var(--success-color)',
            });
            fetchPayments();
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Failed to update payment",
                icon: "error",
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                confirmButtonColor: 'var(--error-color)',
            });
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'paid': { color: 'var(--success-color)', icon: '✅', label: 'Paid' },
            'pending': { color: 'var(--warning-color)', icon: '⏳', label: 'Pending' },
            'overdue': { color: 'var(--error-color)', icon: '🚨', label: 'Overdue' },
            'partial': { color: 'var(--info-color)', icon: '📊', label: 'Partial' }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <span
                className="status-badge"
                style={{
                    backgroundColor: `${config.color}20`,
                    color: config.color,
                    border: `1px solid ${config.color}`
                }}
            >
                <span className="status-icon">{config.icon}</span>
                {config.label}
            </span>
        );
    };

    const getPaymentTypeIcon = (type) => {
        const icons = {
            'maintenance': '🔧',
            'security': '🛡️',
            'utilities': '💡',
            'parking': '🚗',
            'amenities': '🏊‍♂️',
            'fine': '📋',
            'other': '📄'
        };
        return icons[type?.toLowerCase()] || '💳';
    };

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.status === filter;
    });

    const calculateTotals = () => {
        const total = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const paid = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const pending = total - paid;

        return { total, paid, pending };
    };

    const totals = calculateTotals();

    if (isLoading) {
        return (
            <div className="payments-container">
                <div className="loading-container">
                    <div className="loading-spinner">⟳</div>
                    <p>Loading payments...</p>
                </div>

                <style jsx>{`
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 300px;
                        color: var(--text-secondary);
                    }
                    
                    .loading-spinner {
                        font-size: 2rem;
                        animation: spin 1s linear infinite;
                        margin-bottom: 1rem;
                        color: var(--primary-color);
                    }
                    
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="payments-container">
            <style jsx>{`
                .payments-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0;
                    animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .page-header {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                .page-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--primary-gradient);
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--primary-gradient);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .header-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .stat-item {
                    text-align: center;
                    padding: 1rem;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(72, 187, 120, 0.2);
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .filters-section {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                }

                .filter-buttons {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--glass-border);
                    border-radius: 20px;
                    background: var(--glass-bg);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    font-weight: 500;
                    backdrop-filter: blur(10px);
                }

                .filter-btn.active {
                    background: var(--primary-gradient);
                    color: white;
                    border-color: var(--primary-color);
                    box-shadow: 0 2px 10px rgba(72, 187, 120, 0.3);
                }

                .filter-btn:hover:not(.active) {
                    background: var(--bg-tertiary);
                    border-color: var(--primary-color);
                    color: var(--text-color);
                }

                .payments-table-container {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                }

                .payments-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    background: transparent;
                }

                .payments-table th {
                    background: var(--bg-tertiary);
                    color: var(--text-color);
                    padding: 1.25rem 1rem;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 2px solid var(--primary-color);
                }

                .payments-table td {
                    padding: 1.25rem 1rem;
                    border-bottom: 1px solid var(--card-border);
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                    vertical-align: middle;
                }

                .payments-table tr:hover td {
                    background: var(--bg-tertiary);
                }

                .amount-cell {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--text-color);
                }

                .type-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                }

                .type-icon {
                    font-size: 1.2rem;
                }

                .status-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                }

                .status-icon {
                    font-size: 0.9rem;
                }

                .date-cell {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                }

                .action-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: var(--success-color);
                    color: white;
                    box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
                }

                .action-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: var(--text-secondary);
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                @media (max-width: 768px) {
                    .header-stats {
                        grid-template-columns: 1fr;
                    }

                    .payments-table-container {
                        overflow-x: auto;
                    }

                    .payments-table th,
                    .payments-table td {
                        padding: 0.75rem 0.5rem;
                        font-size: 0.85rem;
                    }

                    .filter-buttons {
                        justify-content: center;
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">
                        💳 My Payments
                    </h1>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <div className="stat-value">₹{totals.total.toLocaleString()}</div>
                        <div className="stat-label">Total Amount</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">₹{totals.paid.toLocaleString()}</div>
                        <div className="stat-label">Paid</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">₹{totals.pending.toLocaleString()}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        📋 All Payments
                    </button>
                    <button
                        className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
                        onClick={() => setFilter('paid')}
                    >
                        ✅ Paid
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        ⏳ Pending
                    </button>
                    <button
                        className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
                        onClick={() => setFilter('overdue')}
                    >
                        🚨 Overdue
                    </button>
                </div>
            </div>

            <div className="payments-table-container">
                {filteredPayments.length > 0 ? (
                    <table className="payments-table">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th>Date</th>
                                <th>Due</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment.payment_id}>
                                    <td className="amount-cell">
                                        ₹{parseFloat(payment.amount).toLocaleString()}
                                    </td>
                                    <td className="type-cell">
                                        <span className="type-icon">
                                            {getPaymentTypeIcon(payment.payment_type)}
                                        </span>
                                        {payment.payment_type}
                                    </td>
                                    <td>
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td>{payment.payment_method || 'Not specified'}</td>
                                    <td className="date-cell">
                                        {payment.payment_date ?
                                            new Date(payment.payment_date).toLocaleDateString() :
                                            '-'
                                        }
                                    </td>
                                    <td className="date-cell">
                                        {payment.due_date ?
                                            new Date(payment.due_date).toLocaleDateString() :
                                            '-'
                                        }
                                    </td>
                                    <td>
                                        {payment.status !== 'paid' && (
                                            <button
                                                className="action-btn"
                                                onClick={() => markAsPaid(payment.payment_id)}
                                            >
                                                ✅ Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">💳</div>
                        <h3>No payments found</h3>
                        <p>No payments match the current filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;