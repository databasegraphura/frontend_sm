import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import '../Assets/default-avatar.png';

// A helper component to render different SVG icons dynamically
const Icon = ({ type }) => {
    const icons = {
        dashboard: <svg width="20" height="20" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
        chart: <svg width="20" height="20" viewBox="0 0 24 24"><polyline points="22,6 13.5,15.5 8.5,10.5 2,17" /><polyline points="16,6 22,6 22,12" /></svg>,
        clock: <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>,
        users: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        report: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" /></svg>,
        document: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
        database: <svg width="20" height="20" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
        transfer: <svg width="20" height="20" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7,7 17,7 17,17" /></svg>,
        star: <svg width="20" height="20" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>,
        dollar: <svg width="20" height="20" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
        check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
        logout: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
    };
    // Clones the selected SVG and adds common styling props
    return React.cloneElement(icons[type] || <svg />, {
        fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    });
};

// Configuration object for navigation items based on user role
const navConfig = {
    manager: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Total Projects', path: '/total-projects', icon: 'chart' },
        { label: 'Working Projects', path: '/working-projects', icon: 'clock' },
        { label: 'Team Members', path: '/team-members', icon: 'users' },
        { label: 'Manager Report', path: '/manager-report', icon: 'report' },
        { label: 'Team Report', path: '/team-report', icon: 'document' },
        { label: 'Received Data', path: '/received-data', icon: 'database' },
        { label: 'Transfer Data', path: '/transfer-data', icon: 'transfer' },
        { label: 'Review', path: '/review', icon: 'star' },
        { label: 'Salary', path: '/salary', icon: 'dollar' }
    ],
    team_lead: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Projects', path: '/total-projects', icon: 'chart' },
        { label: 'My Team', path: '/team', icon: 'users' },
        { label: 'Tranfer Projects', path: '/transfer-data', icon: 'users' },
        { label: 'Team Report', path: '/team-report', icon: 'document' },
        { label: 'Reviews', path: '/tlreview', icon: 'document' },
        { label: 'Help', path: '/help', icon: 'check' },
    ],
    executive: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'My Projects', path: '/my-projects', icon: 'clock' },
        { label: 'Completed Projects', path: '/completed-projects', icon: 'check' },
        { label: 'My Payout', path: '/my-payout', icon: 'dollar' },
        { label: 'Help', path: '/help', icon: 'check' },
    ]
};

const Sidebar = ({ isOpen, user, onLogout }) => {
    const location = useLocation();
    
    const navItems = user ? navConfig[user.role] || [] : [];

    const formatRole = (role) => {
        if (!role) return '';
        return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                <div className="logo-section">
                    <img src="./Assets/logo.png" alt="GRAPHURA" className="logo-image" />
                </div>

                <div className="profile-section">
  <div className="avatar">
    {user?.photo && user.photo.trim() !== "" ? (
      <img
        src={user.photo}
        alt="avatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/Assets/default-avatar.png"; // fallback image path
        }}
      />
    ) : (
      <img src="/Assets/default-avatar.png" alt="default avatar" />
    )}
  </div>

  <div className="profile-info">
    <div className="name">{user?.name || "Guest"}</div>
    <div className="role">{formatRole(user?.role)}</div>
  </div>
</div>


                <nav className="nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon"><Icon type={item.icon} /></span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="logout-section">
                    <button className="logout-button" onClick={onLogout}>
                        <span className="nav-icon"><Icon type="logout" /></span>
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
