import React, { useState, useEffect } from 'react';
import './TeamReport.css';

const TeamReport = ({ user }) => { 
  const [reportData, setReportData] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState('');

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
        const reportRes = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/reports/team-report`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!reportRes.ok) throw new Error('Failed to fetch team report.');
        const responseJson = await reportRes.json();
        const projects = responseJson.data.teamReport?.teamMemberProjects || [];

        const memberStats = projects.reduce((acc, project) => {
          if (!project.assignedTo || !project.assignedTo._id) {
            return acc;
          }

          const userId = project.assignedTo._id;
          const name = project.assignedTo.name;

          if (!acc[userId]) {
            acc[userId] = {
              userId,
              name,
              currentProjects: 0,
              completedProjects: 0,
              delayedProjects: 0,
            };
          }

          const today = new Date();
          const endDate = new Date(project.endDate);

          if (endDate < today) {
            acc[userId].completedProjects += 1;
          } else {
            acc[userId].currentProjects += 1;
          }

          return acc;
        }, {});

        setReportData(Object.values(memberStats));

        if (user.role === 'manager') {
          const leadersRes = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/users?role=team_lead`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (!leadersRes.ok) throw new Error('Failed to fetch team leaders.');
          const leadersData = await leadersRes.json();
          setTeamLeaders(leadersData.data.users || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
        fetchData();
    }
  }, [user]);

  const handleView = async (member) => {
    setSelectedMember(member);
    setIsProjectListModalOpen(true);
    setIsModalLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/reports/team-report/projects/${member.userId}`;
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

  if (isLoading) return <div className="loading-message">Loading Team Report...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="team-report">
      <h1 className="team-report-title">Team Report</h1>

      {/* Conditionally render the filter section only for managers */}
      {user && user.role === 'manager' && (
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Team Leader Name</label>
            <select className="dropdown-button">
              <option value="">All Team Leaders</option>
              {teamLeaders.map(leader => (
                <option key={leader._id} value={leader._id}>{leader.name}</option>
              ))}
            </select>
          </div>
          <button className="search-button">Search</button>
        </div>
      )}

      <div className="table-container">
        <table className="team-report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Projects</th>
              <th>Completed Projects</th>
              <th>Delayed Projects</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? reportData.map((item) => (
              <tr key={item.userId}>
                <td className="name-cell">{item.name}</td>
                <td>{item.currentProjects}</td>
                <td>{item.completedProjects}</td>
                <td>{item.delayedProjects}</td>
                <td className="action-cell">
                  <button className="view-button" onClick={() => handleView(item)}>View Projects</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5">No report data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isProjectListModalOpen && selectedMember && (
         <div className="project-list-overlay" onClick={handleCloseProjectListModal}>
          <div className="project-list-container" onClick={(e) => e.stopPropagation()}>
            <div className="project-list-main">
              <div className="project-list-header">
                <h2 className="project-list-title">Projects for {selectedMember.name}</h2>
              </div>
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
        </div>
      )}
    </div>
  );
};

export default TeamReport;