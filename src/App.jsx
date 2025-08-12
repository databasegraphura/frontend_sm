import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';

// Page imports
import LoginPage from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TotalProjects from './pages/TotalProjects.jsx';
import WorkingProjects from './pages/WorkingProjects.jsx';
import TeamMembers from './pages/TeamMembers.jsx';
import ManagerReport from './pages/ManagerReport.jsx';
import ReceivedData from './pages/ReceivedData.jsx';
import TransferDataToFDBK from './pages/TransferDataToFDBK.jsx';
import Review from './pages/Review.jsx';
import Salary from './pages/Salary.jsx';
import MyProjects from './pages/MyProjects.jsx';
import CompletedProjects from './pages/CompletedProjects.jsx';
import MyPayout from './pages/MyPayout.jsx';
import Proposals from './pages/Proposals.jsx';
import CustomPlan from './pages/CustomPlan.jsx';
import WorkOrder from './pages/WorkOrder.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Settings from './pages/Settings.jsx';

// A component to handle the main layout, sidebar, and header
const MainLayout = ({ user, onLogout, children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="layout">
            <Sidebar isOpen={sidebarOpen} user={user} onLogout={onLogout} />
            <div className={`main ${!sidebarOpen ? 'expanded' : ''}`}>
                <Header onToggleSidebar={toggleSidebar} />
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Main App Component
function App() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/users/me`;
                    const response = await fetch(apiUrl, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.data.user);
                        setIsAuthenticated(true);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    handleLogout();
                }
            }
            setIsLoading(false);
        };
        validateToken();
    }, []);

    const handleLogin = (loggedInUser, token) => {
        localStorage.setItem('authToken', token);
        setUser(loggedInUser);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                {isAuthenticated && user ? (
                    <Route
                        path="/*"
                        element={<MainLayout user={user} onLogout={handleLogout}>
                            {user.role === 'manager' || user.role === 'teamlead' ? (
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/total-projects" element={<TotalProjects />} />
                                    <Route path="/working-projects" element={<WorkingProjects />} />
                                    <Route path="/team-members" element={<TeamMembers />} />
                                    <Route path="/manager-report" element={<ManagerReport />} />
                                    <Route path="/received-data" element={<ReceivedData />} />
                                    <Route path="/transfer-data" element={<TransferDataToFDBK />} />
                                    <Route path="/review" element={<Review />} />
                                    <Route path="/salary" element={<Salary />} />
                                    <Route path="/proposals" element={<Proposals />} />
                                    <Route path="/custom-plan" element={<CustomPlan />} />
                                    <Route path="/work-order" element={<WorkOrder />} />
                                    <Route path="/edit-profile" element={<EditProfile />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="*" element={<Navigate to="/dashboard" />} />
                                </Routes>
                            ) : user.role === 'executive' || user.role === 'sales_executive'  ? (
                                <Routes>
                                    <Route path="/my-projects" element={<MyProjects />} />
                                    <Route path="/completed-projects" element={<CompletedProjects />} />
                                    <Route path="/my-payout" element={<MyPayout />} />
                                    <Route path="/edit-profile" element={<EditProfile />} />
                                    <Route path="*" element={<Navigate to="/my-projects" />} />
                                </Routes>
                            ) :  null}
                        </MainLayout>}
                    />
                ) : (
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;