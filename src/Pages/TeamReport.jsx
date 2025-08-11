import React, { useState, useEffect, useMemo } from 'react';
import './TeamReport.css';

const TeamReport = () => {
  const [initialReportData, setInitialReportData] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [isProjectListModalOpen, setIsProjectListModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const [reportRes, leadersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/reports/team-report`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/users?role=team_lead`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!reportRes.ok) throw new Error('Failed to fetch team report.');
        if (!leadersRes.ok) throw new Error('Failed to fetch team leaders.');

        const reportData = await reportRes.json();
        const leadersData = await leadersRes.json();

        setInitialReportData(reportData.data.teamMemberProjects || []);
        setFilteredReportData(reportData.data.teamMemberProjects || []);
        setTeamLeaders(leadersData.data.users || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (!selectedTeamLeader) {
      setFilteredReportData(initialReportData);
      return;
    }
    const filtered = initialReportData.filter(member => member.assignedTo?._id === selectedTeamLeader);
    setFilteredReportData(filtered);
  };

  const handleView = async (member) => {
    setSelectedMember(member);
    setIsProjectListModalOpen(true);
    setIsModalLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/reports/team-report/projects/${member.assignedTo._id}`;
      const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error("Failed to fetch member's projects.");
      const data = await response.json();
      setMemberProjects(data.data.projects || []);
    } catch (err) {
      console.error(err);
      setMemberProjects([]);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseProjectListModal = () => {
    setIsProjectListModalOpen(false);
    setSelectedMember(null);
    setMemberProjects([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) return <div className="loading-message">Loading Team Report...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="team-report">
      <h1 className="team-report-title">Team Report</h1>

      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">Team Leader Name</label>
          <select className="dropdown-button" value={selectedTeamLeader} onChange={(e) => setSelectedTeamLeader(e.target.value)}>
            <option value="">All Team Leaders</option>
            {teamLeaders.map(leader => (
              <option key={leader._id} value={leader._id}>{leader.name}</option>
            ))}
          </select>
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      <div className="table-container">
        <table className="team-report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Projects</th>
              <th>Completed Projects</th>
              <th>Total Payout</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReportData.length > 0 ? filteredReportData.map((item) => (
              <tr key={item.assignedTo._id}>
                <td className="name-cell">{item.assignedTo.name}</td>
                <td className="data-cell">{item.currentProjects}</td>
                <td className="data-cell">{item.completedProjects}</td>
                <td className="data-cell">₹{item.totalPayout}</td>
                <td className="action-cell">
                  <button className="view-button" onClick={() => handleView(item)}>View</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5">No report data found for the selected criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isProjectListModalOpen && selectedMember && (
        <div className="project-list-overlay">
          <div className="project-list-container">
            <div className="project-list-main">
              <div className="project-list-header">
                <h2 className="project-list-title">Projects for {selectedMember.assignedTo.name}</h2>
              </div>
              <div className="project-list-content">
                {isModalLoading ? <div className="loading-message">Loading projects...</div> : (
                  <div className="project-items">
                    {memberProjects.length > 0 ? memberProjects.map((project, index) => (
                      <div key={project._id} className="project-item-row">
                        <span className="project-number">{index + 1}.</span>
                        <span className="project-text">{project.companyName} || {project.invoiceNumber}</span>
                      </div>
                    )) : <p>No projects found for this member.</p>}
                  </div>
                )}
                <div className="project-actions">
                  <button className="close-btn" onClick={handleCloseProjectListModal}>Close</button>
                </div>
              </div>
            </div>
            <div className="project-right-sidebar">
              <div className="right-sidebar-header">Actions</div>
              <div className="right-sidebar-menu">
                <div className="right-sidebar-item active">View</div>
                <div className="right-sidebar-item">Upload</div>
                <div className="right-sidebar-item">Send</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamReport;
