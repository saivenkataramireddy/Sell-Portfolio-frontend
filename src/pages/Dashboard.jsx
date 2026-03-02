import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Code2,
    Briefcase,
    Award,
    MessageSquare,
    LogOut,
    LayoutDashboard,
    ExternalLink,
    User
} from 'lucide-react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        navigate('/admin');
    };

    const navItems = [
        { title: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { title: 'Manage Skills', icon: <Code2 size={20} />, path: '/dashboard/skills' },
        { title: 'Manage Projects', icon: <BarChart3 size={20} />, path: '/dashboard/projects' },
        { title: 'Manage Journey', icon: <Briefcase size={20} />, path: '/dashboard/journey' },
        { title: 'Certifications', icon: <Award size={20} />, path: '/dashboard/certifications' },
        { title: 'Messages', icon: <MessageSquare size={20} />, path: '/dashboard/messages' },
        { title: 'Profile', icon: <User size={20} />, path: '/dashboard/profile' },
    ];

    return (
        <div className="dashboard-layout container section">
            <div className="dashboard-grid">
                {/* Sidebar */}
                <motion.aside
                    className="dashboard-sidebar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="admin-profile">
                        <div className="admin-avatar">
                            {adminEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-info">
                            <span className="admin-name">Administrator</span>
                            <span className="admin-email">{adminEmail}</span>
                        </div>
                    </div>

                    <nav className="dashboard-nav">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link-item ${window.location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </nav>

                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </motion.aside>

                {/* Main Content Area */}
                <main className="dashboard-main-content">
                    <Outlet />
                    {window.location.pathname === '/dashboard' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="dashboard-welcome"
                        >
                            <div className="welcome-header">
                                <h2>Welcome back, Admin!</h2>
                                <p>What would you like to update today?</p>
                            </div>

                            <div className="quick-stats-grid">
                                <div className="stat-card">
                                    <span className="stat-label">Visit Live Site</span>
                                    <a href="/" target="_blank" className="stat-value flex items-center gap-2">
                                        Portfolio <ExternalLink size={20} />
                                    </a>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">System Status</span>
                                    <span className="stat-value text-green">Online</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
