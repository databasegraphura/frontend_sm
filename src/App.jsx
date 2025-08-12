import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Page imports
import LoginPage from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import TotalProjects from './Pages/TotalProjects.jsx';
import WorkingProjects from './Pages/WorkingProjects.jsx';
import TeamMembers from './Pages/TeamMembers.jsx';
import ManagerReport from './Pages/ManagerReport.jsx';
import ReceivedData from './Pages/ReceivedData.jsx';
import TransferDataToFDBK from './Pages/TransferDataToFDBK.jsx';
import Review from './Pages/Review.jsx';
import Salary from './Pages/Salary.jsx';
import MyProjects from './Pages/MyProjects.jsx';
import CompletedProjects from './Pages/CompletedProjects.jsx';
import MyPayout from './Pages/MyPayout.jsx';
import Proposals from './Pages/Proposals.jsx';
import CustomPlan from './Pages/CustomPlan.jsx';
import WorkOrder from './Pages/WorkOrder.jsx';
import EditProfile from './Pages/EditProfile.jsx';
import Settings from './Pages/Settings.jsx';
import TeamReport from './Pages/TeamReport.jsx';
import MyTeam from './Pages/MyTeam.jsx';
import TlReview from './Pages/TlReview.jsx';
import Help from './Pages/Help.jsx';


const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


const MainLayout = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} user={user} onLogout={onLogout} />
      <div className={`main ${!sidebarOpen ? 'expanded' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} />
        <div className="content">
          {children} {/* This is where the role-specific <Routes> component will be rendered */}
        </div>
      </div>
    </div>
  );
};

// --- Role-based Route Components ---
// Each of these components defines a complete set of routes for a specific user role.
// This separation is key to preventing the rendering loop.

const ManagerRoutes = ({ user }) => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard user={user} />} />
    <Route path="/total-projects" element={<TotalProjects user={user} />} />
    <Route path="/working-projects" element={<WorkingProjects user={user} />} />
    <Route path="/team-members" element={<TeamMembers user={user} />} />
    <Route path="/manager-report" element={<ManagerReport user={user} />} />
    <Route path="/team-report" element={<TeamReport user={user} />} />
    <Route path="/received-data" element={<ReceivedData user={user} />} />
    <Route path="/transfer-data" element={<TransferDataToFDBK user={user} />} />
    <Route path="/review" element={<Review user={user} />} />
    <Route path="/salary" element={<Salary user={user} />} />
    <Route path="/proposals" element={<Proposals user={user} />} />
    <Route path="/custom-plan" element={<CustomPlan user={user} />} />
    <Route path="/work-order" element={<WorkOrder user={user} />} />
    <Route path="/edit-profile" element={<EditProfile user={user} />} />
    <Route path="/settings" element={<Settings user={user} />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const TeamLeadRoutes = ({ user }) => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard user={user} />} />
    <Route path="/total-projects" element={<TotalProjects user={user} />} />
    <Route path="/team" element={<MyTeam user={user} />} />

    <Route path="/transfer-data" element={<TransferDataToFDBK user={user} />} />
    <Route path="/team-report" element={<TeamReport user={user} />} />
    <Route path="/tlreview" element={<TlReview user={user} />} />
    <Route path="/edit-profile" element={<EditProfile user={user} />} />
    <Route path="/help" element={<Help />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const ExecutiveRoutes = ({ user }) => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard user={user} />} />
    <Route path="/my-projects" element={<MyProjects user={user} />} />
    <Route path="/completed-projects" element={<CompletedProjects user={user} />} />
    <Route path="/my-payout" element={<MyPayout user={user} />} />
    <Route path="/edit-profile" element={<EditProfile user={user} />} />
    <Route path="/help" element={<Help />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

// --- Main App Component ---
function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to validate token on initial load. Runs only once.
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
            handleLogout(); // Token is invalid or expired
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

  // Function to handle successful login
  const handleLogin = (loggedInUser, token) => {
    localStorage.setItem('authToken', token);
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const renderRoutesForRole = (user) => {
    switch (user.role) {
      case 'manager':
        return <ManagerRoutes user={user} />;
      case 'team_lead':
        return <TeamLeadRoutes user={user} />;
      case 'executive':
        return <ExecutiveRoutes user={user} />;
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

                {user && renderRoutesForRole(user)}
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
