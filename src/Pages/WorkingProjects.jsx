import React, { useState, useEffect } from 'react';
// import './WorkingProjects.css';

const WorkingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProjects, setExpandedProjects] = useState({});

  useEffect(() => {
    const fetchWorkingProjects = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/projects?status=Current`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch working projects.');
        }

        const data = await response.json();
        setProjects(data.data.projects || []);

        if (data.data.projects && data.data.projects.length > 0) {
          setExpandedProjects({ [data.data.projects[0]._id]: true });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkingProjects();
  }, []);

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  if (isLoading) {
    return <div className="loading-message">Loading Working Projects...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="working-projects">
      <h1 className="page-title">Working Projects</h1>

      {projects.length > 0 ? projects.map((project, index) => (
        <div key={project._id} className="project-section">
          <button
            className={`project-header ${expandedProjects[project._id] ? 'expanded' : ''}`}
            onClick={() => toggleProject(project._id)}
          >
            <div className="project-info">
              <span>{index + 1}. {project.companyName || 'N/A'}</span>
              <span>Invoice: {project.invoiceNumber || 'N/A'}</span>
            </div>
            <span className="chevron">▼</span>
          </button>

          <div className={`project-content ${expandedProjects[project._id] ? 'expanded' : ''}`}>
            <div className="client-form">
              <div className="form-group"><label>Client Name</label><input type="text" value={project.clientName || ''} readOnly /></div>
              <div className="form-group"><label>Designation</label><input type="text" value={project.designation || ''} readOnly /></div>
              <div className="form-group"><label>Contact No.</label><input type="tel" value={project.contactNumber || ''} readOnly /></div>
              <div className="form-group"><label>Email ID</label><input type="email" value={project.email || ''} readOnly /></div>
              <div className="form-group"><label>Start Date</label><input type="date" value={formatDate(project.startDate)} readOnly /></div>
              <div className="form-group"><label>End Date</label><input type="date" value={formatDate(project.endDate)} readOnly /></div>
              <div className="form-group full-width"><label>Service Name</label><input type="text" value={project.serviceName || ''} readOnly /></div>
            </div>

            <button className="edit-team-btn">Edit Team</button>

            <div className="company-details">
              <h3>Company Details</h3>
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Service Task</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {project.tasks && project.tasks.length > 0 ? project.tasks.map(task => (
                    <tr key={task._id}>
                      <td>{task.name}</td>
                      <td>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-video">Video</button>
                          <button className="btn-download">Download</button>
                          <button className="btn-upload">Upload</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3">No tasks found for this project.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )) : (
        <p className="no-projects-message">There are no projects currently in the "Working" status.</p>
      )}
    </div>
  );
};

export default WorkingProjects;
