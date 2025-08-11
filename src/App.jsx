import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import TotalProjects from './pages/TotalProjects';
import WorkingProjects from './pages/WorkingProjects';
import TeamMembers from './pages/TeamMembers';
import ManagerReport from './pages/ManagerReport';
import ReceivedData from './pages/ReceivedData';
import TransferDataToFDBK from './pages/TransferDataToFDBK';
import Review from './pages/Review';
import TeamReport from './pages/TeamReport';
import Salary from './pages/Salary';
import MyProjects from './pages/MyProjects';
import CompletedProjects from './pages/CompletedProjects';
import MyPayout from './pages/MyPayout';
import Proposals from './pages/Proposals';
import CustomPlan from './pages/CustomPlan';
import WorkOrder from './pages/WorkOrder';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- Main Layout Component ---
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

// --- Role-based Route Components ---
const ManagerRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/total-projects" element={<TotalProjects />} />
    <Route path="/working-projects" element={<WorkingProjects />} />
    <Route path="/team-members" element={<TeamMembers />} />
    <Route path="/manager-report" element={<ManagerReport />} />
    <Route path="/team-report" element={<TeamReport />} />
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
);

const TeamLeadRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects" element={<TotalProjects />} />
    <Route path="/team" element={<TeamMembers />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const ExecutiveRoutes = () => (
  <Routes>
    <Route path="/my-projects" element={<MyProjects />} />
    <Route path="/completed-projects" element={<CompletedProjects />} />
    <Route path="/my-payout" element={<MyPayout />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="*" element={<Navigate to="/my-projects" />} />
  </Routes>
);

// --- Main App Component ---
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
          console.error("Token validation failed:", error);
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

  const renderRoutesForRole = (role) => {
    switch (role) {
      case 'manager':
        return <ManagerRoutes />;
      case 'team_lead':
        return <TeamLeadRoutes />;
      case 'executive':
        return <ExecutiveRoutes />;
      default:
        return <Navigate to="/login" />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout user={user} onLogout={handleLogout}>
                {user && renderRoutesForRole(user.role)}
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;