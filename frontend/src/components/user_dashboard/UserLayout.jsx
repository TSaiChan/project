import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './css/userLayout.css';
import './css/theme.css';
import './css/globals.css';

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [theme, setTheme] = useState(() => {
        // Check for saved theme preference or default to 'dark' to match homepage
        return localStorage.getItem('theme') || 'dark';
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set theme on component mount
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem('theme', theme);

        // Add loading animation
        setTimeout(() => {
            setIsLoading(false);
        }, 300);

        console.log("🚀 UserLayout initialized with theme:", theme);
    }, [theme]);

    const handleLogout = () => {
        // Add smooth logout animation
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');

        if (sidebar && mainContent) {
            sidebar.style.transform = 'translateX(-100%)';
            mainContent.style.opacity = '0';
        }

        setTimeout(() => {
            sessionStorage.clear();
            localStorage.removeItem('theme');
            navigate('/');
        }, 300);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        // Add theme transition effect
        document.documentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    };

    const navigationItems = [
        {
            to: "/user-dashboard/",
            label: "Home",
            icon: "🏠",
            exact: true
        },
        {
            to: "/user-dashboard/payments",
            label: "Payments",
            icon: "💳"
        },
        {
            to: "/user-dashboard/notifications",
            label: "Notifications",
            icon: "🔔"
        },
        {
            to: "/user-dashboard/maintenance",
            label: "Maintenance",
            icon: "🔧"
        },
        {
            to: "/user-dashboard/visitors",
            label: "Visitor Logs",
            icon: "👥"
        }
    ];

    const isActiveLink = (item) => {
        if (item.exact) {
            return location.pathname === item.to;
        }
        return location.pathname.startsWith(item.to);
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'var(--bg-color)',
                color: 'var(--text-color)'
            }}>
                <div style={{
                    fontSize: '2rem',
                    background: 'var(--primary-gradient)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="user-layout">
            <style jsx>{`
                .user-layout {
                    opacity: 0;
                    animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .sidebar-header {
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .nav-item {
                    position: relative;
                    margin: 0.5rem 0;
                }

                .nav-link {
                    color: rgba(255, 255, 255, 0.9);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    border-radius: 12px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid transparent;
                    backdrop-filter: blur(5px);
                }

                .nav-link.active {
                    background: var(--primary-gradient);
                    color: white;
                    box-shadow: 0 4px 20px rgba(72, 187, 120, 0.4);
                    border-color: var(--primary-hover);
                    transform: translateX(5px);
                }

                .nav-link:not(.active)::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: var(--primary-gradient);
                    opacity: 0.1;
                    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: -1;
                }

                .nav-link:not(.active):hover {
                    color: white;
                    background: rgba(72, 187, 120, 0.2);
                    border-color: var(--primary-color);
                    transform: translateX(5px);
                    box-shadow: 0 4px 20px rgba(72, 187, 120, 0.3);
                }

                .nav-link:not(.active):hover::before {
                    left: 0;
                }

                .nav-icon {
                    font-size: 1.1rem;
                    margin-right: 0.75rem;
                    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
                    transition: all 0.3s ease;
                }

                .nav-link:hover .nav-icon {
                    transform: scale(1.1);
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
                }

                .nav-text {
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                .sidebar-footer {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .control-button {
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .theme-toggle-btn {
                    background: var(--glass-bg);
                    color: rgba(255, 255, 255, 0.9);
                }

                .theme-toggle-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
                }

                .logout-btn {
                    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
                    color: white;
                    border: none;
                }

                .logout-btn:hover {
                    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(245, 101, 101, 0.4);
                }

                .main-content-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-color);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .content-header {
                    padding: 1.5rem 2rem 0;
                    background: var(--bg-color);
                    border-bottom: 1px solid var(--card-border);
                    backdrop-filter: blur(10px);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .breadcrumb {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .page-title {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: var(--text-color);
                    margin: 0;
                    background: var(--primary-gradient);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
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

                @media (max-width: 768px) {
                    .nav-text {
                        display: none;
                    }
                    
                    .nav-link {
                        justify-content: center;
                        padding: 1rem 0.75rem;
                    }
                    
                    .nav-icon {
                        margin: 0;
                        font-size: 1.2rem;
                    }
                    
                    .control-button {
                        padding: 0.75rem;
                    }
                    
                    .theme-toggle-btn .nav-text,
                    .logout-btn .nav-text {
                        display: none;
                    }
                }
            `}</style>

            <aside className="sidebar sidebar-loading">
                <div>
                    <div className="sidebar-header">
                        <h3>GCMS Portal</h3>
                    </div>

                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {navigationItems.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <Link
                                        to={item.to}
                                        className={`nav-link ${isActiveLink(item) ? 'active' : ''}`}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-text">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <button
                        className="control-button theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        <span className="nav-icon">
                            {theme === "dark" ? "🌙" : "☀️"}
                        </span>
                        <span className="nav-text">
                            {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </span>
                    </button>

                    <button
                        className="control-button logout-btn"
                        onClick={handleLogout}
                        aria-label="Logout"
                    >
                        <span className="nav-icon">🚪</span>
                        <span className="nav-text">Logout</span>
                    </button>
                </div>
            </aside>

            <div className="main-content-wrapper">
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;