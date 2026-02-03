import React from 'react';
import './Navbar.css';

interface NavbarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'sorting', label: 'Sorting', icon: '📊' },
        { id: 'searching', label: 'Searching', icon: '🔍' },
        { id: 'graph', label: 'Graph', icon: '🔗' },
        { id: 'tree', label: 'Tree', icon: '🌳' },
        { id: 'dp', label: 'DP', icon: '🧮' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => onNavigate('home')}>
                <span className="navbar-logo">⚡</span>
                <span className="navbar-title">AlgoVisualize</span>
            </div>

            <div className="navbar-links">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`navbar-link ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="navbar-link-icon">{item.icon}</span>
                        <span className="navbar-link-label">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="navbar-actions">
                <button className="btn btn-ghost">
                    <span>🌙</span>
                </button>
            </div>
        </nav>
    );
};
