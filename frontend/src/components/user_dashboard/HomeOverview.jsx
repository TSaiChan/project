import React, { useEffect, useState } from 'react';

const HomeOverview = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats] = useState({
        totalPayments: 12,
        pendingRequests: 3,
        unreadNotifications: 7,
        recentVisitors: 5
    });

    useEffect(() => {
        console.log("🏠 HomeOverview loaded");

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        // Add entrance animation classes
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-slide-up');
            }, index * 150);
        });

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const quickActions = [
        { title: "Make Payment", icon: "💳", color: "var(--success-color)", path: "/user-dashboard/payments" },
        { title: "Request Maintenance", icon: "🔧", color: "var(--warning-color)", path: "/user-dashboard/maintenance" },
        { title: "Register Visitor", icon: "👥", color: "var(--info-color)", path: "/user-dashboard/visitors" },
        { title: "View Notifications", icon: "🔔", color: "var(--accent-purple)", path: "/user-dashboard/notifications" }
    ];

    const recentActivity = [
        { type: "payment", message: "Monthly maintenance fee paid", time: "2 hours ago", status: "success" },
        { type: "maintenance", message: "AC repair request submitted", time: "1 day ago", status: "pending" },
        { type: "visitor", message: "Guest registered for today", time: "3 days ago", status: "info" },
        { type: "notification", message: "Community meeting reminder", time: "1 week ago", status: "info" }
    ];

    return (
        <div className="home-overview">
            <style jsx>{`
                .home-overview {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0;
                }

                .welcome-section {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 20px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                .welcome-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--primary-gradient);
                }

                .welcome-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .welcome-text h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    background: var(--primary-gradient);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .welcome-text p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    margin: 0;
                }

                .time-display {
                    text-align: right;
                }

                .time {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-color);
                    display: block;
                }

                .date {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: var(--primary-gradient);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--card-hover-shadow);
                    border-color: var(--primary-color);
                }

                .stat-card:hover::before {
                    transform: translateX(0);
                }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    backdrop-filter: blur(10px);
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-color);
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .quick-actions {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .actions-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .action-button {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 1rem;
                    text-align: center;
                    text-decoration: none;
                    color: var(--text-color);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                .action-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s;
                }

                .action-button:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--card-hover-shadow);
                    border-color: var(--primary-color);
                }

                .action-button:hover::before {
                    left: 100%;
                }

                .action-icon {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .action-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .recent-activity {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                }

                .activity-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .activity-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--card-border);
                    transition: all 0.2s ease;
                }

                .activity-item:last-child {
                    border-bottom: none;
                }

                .activity-item:hover {
                    background: var(--bg-tertiary);
                    margin: 0 -1rem;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    border-radius: 8px;
                }

                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                }

                .activity-content {
                    flex: 1;
                }

                .activity-message {
                    color: var(--text-color);
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }

                .activity-time {
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .activity-status {
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-success {
                    background: rgba(72, 187, 120, 0.2);
                    color: var(--success-color);
                }

                .status-pending {
                    background: rgba(237, 137, 54, 0.2);
                    color: var(--warning-color);
                }

                .status-info {
                    background: rgba(66, 153, 225, 0.2);
                    color: var(--info-color);
                }

                .dashboard-card {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .dashboard-card.animate-slide-up {
                    opacity: 1;
                    transform: translateY(0);
                }

                @media (max-width: 768px) {
                    .welcome-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .time-display {
                        text-align: center;
                    }

                    .content-grid {
                        grid-template-columns: 1fr;
                    }

                    .actions-grid {
                        grid-template-columns: 1fr;
                    }

                    .welcome-text h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="welcome-section dashboard-card">
                <div className="welcome-header">
                    <div className="welcome-text">
                        <h1>{getGreeting()}, {user?.display_name || "User"}!</h1>
                        <p>Welcome back to your community dashboard</p>
                    </div>
                    <div className="time-display">
                        <span className="time">{formatTime()}</span>
                        <span className="date">{formatDate()}</span>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card dashboard-card">
                    <div className="stat-header">
                        <div className="stat-icon">💳</div>
                    </div>
                    <div className="stat-value">{stats.totalPayments}</div>
                    <div className="stat-label">Total Payments</div>
                </div>

                <div className="stat-card dashboard-card">
                    <div className="stat-header">
                        <div className="stat-icon">🔧</div>
                    </div>
                    <div className="stat-value">{stats.pendingRequests}</div>
                    <div className="stat-label">Pending Requests</div>
                </div>

                <div className="stat-card dashboard-card">
                    <div className="stat-header">
                        <div className="stat-icon">🔔</div>
                    </div>
                    <div className="stat-value">{stats.unreadNotifications}</div>
                    <div className="stat-label">New Notifications</div>
                </div>

                <div className="stat-card dashboard-card">
                    <div className="stat-header">
                        <div className="stat-icon">👥</div>
                    </div>
                    <div className="stat-value">{stats.recentVisitors}</div>
                    <div className="stat-label">Recent Visitors</div>
                </div>
            </div>

            <div className="content-grid">
                <div className="recent-activity dashboard-card">
                    <h3 className="section-title">
                        📊 Recent Activity
                    </h3>
                    <ul className="activity-list">
                        {recentActivity.map((activity, index) => (
                            <li key={index} className="activity-item">
                                <div className="activity-icon">
                                    {activity.type === 'payment' && '💳'}
                                    {activity.type === 'maintenance' && '🔧'}
                                    {activity.type === 'visitor' && '👥'}
                                    {activity.type === 'notification' && '🔔'}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-message">{activity.message}</div>
                                    <div className="activity-time">{activity.time}</div>
                                </div>
                                <span className={`activity-status status-${activity.status}`}>
                                    {activity.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="quick-actions dashboard-card">
                    <h3 className="section-title">
                        ⚡ Quick Actions
                    </h3>
                    <div className="actions-grid">
                        {quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.path}
                                className="action-button"
                            >
                                <span className="action-icon">{action.icon}</span>
                                <span className="action-title">{action.title}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeOverview;