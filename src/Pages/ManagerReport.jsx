import React, { useState, useEffect } from 'react';
import './ManagerReport.css';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value-row">
      <span className="stat-value">{value}</span>
      <span className="stat-icon">{icon}</span>
    </div>
  </div>
);

const ManagerReport = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/reports/team-report`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch manager report.');
        }

        const data = await response.json();
        setReportData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleUpdateClick = (companyName) => {
    setSelectedCompany(companyName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const downloadOptions = [
    { label: 'Download Logo', icon: '⬇' },
    { label: 'Client References', icon: '⬇' },
    { label: 'Download Brochure', icon: '⬇' },
    { label: 'Download Content', icon: '⬇' },
    { label: 'Download Client Images', icon: '⬇' },
    { label: 'Download Client Videos', icon: '⬇' },
    { label: 'Download Company Details', icon: '⬇' },
    { label: 'Other Details', icon: '⬇' }
  ];

  if (isLoading) return <div className="loading-message">Loading Manager Report...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!reportData) return <div className="no-data-message">No report data available.</div>;

  const { stats, teamMemberProjects } = reportData;

  return (
    <div className="manager-report-page">
      <h1 className="manager-title">Manager Report</h1>

      <div className="stat-cards-row">
        <StatCard label="TOTAL PROJECTS" value={stats?.totalProjects || 0} icon="🗂️" color="blue" />
        <StatCard label="COMPLETED PROJECTS" value={stats?.completedProjects || 0} icon="✔️" color="green" />
        <StatCard label="PENDING PROJECTS" value={stats?.pendingProjects || 0} icon="⏳" color="cyan" />
        <StatCard label="LAST MONTH PAYOUT" value={`₹${stats?.lastMonthPayout || 0}`} icon="₹" color="orange" />
      </div>

      <div className="my-projects-section">
        <h2 className="my-projects-title">Team Member Projects</h2>
        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Assigned To</th>
                <th>Services</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {teamMemberProjects && teamMemberProjects.length > 0 ? teamMemberProjects.map((project) => (
                <tr key={project._id}>
                  <td><b>{project.companyName}</b></td>
                  <td>{project.assignedTo?.name || 'N/A'}</td>
                  <td><b>{project.serviceName}</b></td>
                  <td><b>{formatDate(project.startDate)}</b></td>
                  <td><b>{formatDate(project.endDate)}</b></td>
                  <td>
                    <button className="update-btn" onClick={() => handleUpdateClick(project.companyName)}>
                      Update
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6">No projects found for team members.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedCompany}</h2>
            <div className="download-options">
              {downloadOptions.map((option, idx) => (
                <div key={idx} className="download-row">
                  <div className="download-option">
                    <span className="download-label">{option.label}</span>
                    <span className="download-icon">{option.icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReport;