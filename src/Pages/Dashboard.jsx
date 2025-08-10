import React, { useState, useEffect } from 'react';

// This component will render the individual statistic cards
const StatCard = ({ title, value, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div>
      <div>{title}</div>
      <div>{value}</div>
    </div>
    <div>{icon}</div>
  </div>
);

// This component renders the SVG icons
const Icon = ({ type }) => {
  const icons = {
    folder: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    chart: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    ),
    check: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    refresh: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
      </svg>
    ),
    users: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    clipboard: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
    rupee: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12" /><path d="M6 8h12" /><path d="M6 13l8.5 8" /><path d="M6 13h3" /><path d="M9 13c6.667 0 6.667-10 0-10" />
      </svg>
    ),
    transfer: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  };
  return icons[type] || null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/dashboard/stats`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return <div>Loading Dashboard...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!stats) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <StatCard title="TOTAL PROJECTS" value={stats.totalProjects || 0} icon={<Icon type="folder" />} color="blue" />
        <StatCard title="CURRENT PROJECTS" value={stats.currentProjects || 0} icon={<Icon type="chart" />} color="green" />
        <StatCard title="COMPLETED PROJECTS" value={stats.completedProjects || 0} icon={<Icon type="check" />} color="cyan" />
        <StatCard title="REMAINING PROJECTS" value={stats.remainingProjects || 0} icon={<Icon type="refresh" />} color="orange" />

        <StatCard title="TOTAL EMPLOYEES" value={stats.totalEmployees || 0} icon={<Icon type="users" />} color="blue" />
        <StatCard title="TOTAL TLS" value={stats.totalTeamLeads || 0} icon={<Icon type="clipboard" />} color="green" />
        <StatCard title="TOTAL INCOME" value={stats.totalIncome || 0} icon={<Icon type="rupee" />} color="cyan" />
        <StatCard title="LAST MONTH INCOME" value={stats.lastMonthIncome || 0} icon={<Icon type="rupee" />} color="orange" />
      </div>

      <h2>Feedback Department</h2>
      <div>
        <StatCard title="TOTAL CLIENT RECEIVED" value={stats.totalClientsReceived || 0} icon={<Icon type="folder" />} color="blue" />
        <StatCard title="DELAY PROJECTS" value={stats.delayedProjects || 0} icon={<Icon type="refresh" />} color="green" />
        <StatCard title="TOTAL INCOME" value={stats.feedbackDeptTotalIncome || 0} icon={<Icon type="rupee" />} color="cyan" />
        <StatCard title="TOTAL IMPORT DATA" value={stats.totalImportedData || 0} icon={<Icon type="transfer" />} color="orange" />
      </div>
    </div>
  );
};

export default Dashboard;
