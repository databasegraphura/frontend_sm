import React, { useState, useEffect } from 'react';
import './TotalProjects.css';

const TotalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [isFirstSectionExpanded, setIsFirstSectionExpanded] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/projects`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setProjects(data.data.projects || []);
        } else {
          throw new Error(data.message || 'Failed to fetch projects.');
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const toggleFirstSection = () => {
    setIsFirstSectionExpanded(!isFirstSectionExpanded);
  };

  const handleAssignProjectClick = (project) => {
    setSelectedProject(project);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedProject(null);
  };

  const handleActionClick = (action, service) => {
    console.log(`Clicked ${action} for ${service}`);
    // Dummy handler for all action buttons
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  if (isLoading) {
    return <div className="loading-message">Loading Projects...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="total-projects">
      <h1 className="page-title">Total Projects</h1>
      
      {/* First Section: "1. Renu Sharma" */}
      <div className="project-section">
        <div
          className={`project-header ${isFirstSectionExpanded ? 'expanded' : ''}`}
          onClick={toggleFirstSection}
        >
          <div className="project-title">
            <span className="project-number">1.</span>
            <span className="company-name">Renu Sharma</span>
            <span className="invoice-text">Invoice no.</span>
            <span className="invoice-number">INV-2025-101</span>
          </div>
          <div className="project-toggle">{isFirstSectionExpanded ? '▲' : '▼'}</div>
        </div>

        <div className={`project-content ${isFirstSectionExpanded ? 'expanded' : ''}`}>
          <div className="project-details-card">
            <div className="client-form">
              <div className="form-column">
                <div className="form-group">
                  <label>Client Name</label>
                  <input type="text" value="Renu Sharma" readOnly />
                </div>
                <div className="form-group">
                  <label>Contact no.</label>
                  <input type="tel" value="+91 98765 43210" readOnly />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value="2025-01-15" readOnly />
                </div>
                <div className="form-group">
                  <label>Service name</label>
                  <input type="text" value="Website Design" readOnly />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Designation</label>
                  <input type="text" value="Project Manager" readOnly />
                </div>
                <div className="form-group">
                  <label>Email_id</label>
                  <input type="email" value="renu.sharma@example.com" readOnly />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value="2025-03-30" readOnly />
                </div>
                <div className="button-container">
                  <button className="assign-project-btn" onClick={() => handleAssignProjectClick({
                    companyName: "Renu Sharma",
                    serviceName: "Website Design"
                  })}>Assign Project</button>
                </div>
              </div>
            </div>

            <div className="company-details">
              <h3>Company Details</h3>
              <div className="service-table">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Logo</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Logo')}>Message</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Logo')}>Video</button>
                          <button className="action-btn grey" onClick={() => handleActionClick('Download', 'Logo')}>Download</button>
                          <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Logo')}>Upload</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Banner</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Banner')}>Message</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Banner')}>Video</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video/Audio', 'Banner')}>Video / Audio</button>
                          <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Banner')}>Upload</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Bold text column</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Bold text column 1')}>Message</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Bold text column 1')}>Video</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video/Audio', 'Bold text column 1')}>Video / Audio</button>
                          <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Bold text column 1')}>Upload</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Bold text column</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Bold text column 2')}>Message</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Bold text column 2')}>Video</button>
                          <button className="action-btn blue" onClick={() => handleActionClick('Video/Audio', 'Bold text column 2')}>Video / Audio</button>
                          <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Bold text column 2')}>Upload</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {projects.length > 0 ? projects.map((project, index) => (
        <div key={project._id} className="project-section">
          <div
            className={`project-header ${expandedProjects[project._id] ? 'expanded' : ''}`}
            onClick={() => toggleProject(project._id)}
          >
            <div className="project-title">
              <span className="project-number">{index + 2}.</span>
              <span className="company-name">{project.companyName || 'N/A'}</span>
              <span className="invoice-text">Invoice no.</span>
              <span className="invoice-number">{project.invoiceNumber || 'N/A'}</span>
            </div>
            <div className="project-toggle">{expandedProjects[project._id] ? '▲' : '▼'}</div>
          </div>

          <div className={`project-content ${expandedProjects[project._id] ? 'expanded' : ''}`}>
            <div className="project-details-card">
              <div className="client-form">
                <div className="form-column">
                  <div className="form-group">
                    <label>Client Name</label>
                    <input type="text" value={project.clientName || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Contact no.</label>
                    <input type="tel" value={project.contactNumber || 'N/A'} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={formatDate(project.startDate)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Service name</label>
                    <input type="text" value={project.serviceName || ''} readOnly />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label>Designation</label>
                    <input type="text" value={project.designation || 'N/A'} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email_id</label>
                    <input type="email" value={project.email || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" value={formatDate(project.endDate)} readOnly />
                  </div>
                  <div className="button-container">
                    <button className="assign-project-btn" onClick={() => handleAssignProjectClick(project)}>Assign Project</button>
                  </div>
                </div>
              </div>

              <div className="company-details">
                <h3>Company Details</h3>
                <div className="service-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Logo</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Logo')}>Message</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Logo')}>Video</button>
                            <button className="action-btn grey" onClick={() => handleActionClick('Download', 'Logo')}>Download</button>
                            <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Logo')}>Upload</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Banner</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Banner')}>Message</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Banner')}>Video</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video/Audio', 'Banner')}>Video / Audio</button>
                            <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Banner')}>Upload</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Bold text column</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Bold text column 1')}>Message</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Bold text column 1')}>Video</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video/Audio', 'Bold text column 1')}>Video / Audio</button>
                            <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Bold text column 1')}>Upload</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Bold text column</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn blue" onClick={() => handleActionClick('Message', 'Bold text column 2')}>Message</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video', 'Bold text column 2')}>Video</button>
                            <button className="action-btn blue" onClick={() => handleActionClick('Video/Audio', 'Bold text column 2')}>Video / Audio</button>
                            <button className="action-btn green" onClick={() => handleActionClick('Upload', 'Bold text column 2')}>Upload</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <p>No projects found.</p>
      )}

      {isServiceModalOpen && selectedProject && (
        <AssignTaskModal project={selectedProject} onClose={handleCloseServiceModal} />
      )}
    </div>
  );
};

// The AssignTaskModal component remains the same, no changes needed here.
const AssignTaskModal = ({ project, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [taskAssignments, setTaskAssignments] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/users?role=executive&role=team_lead`;
        const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setEmployees(data.data.users || []);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSelectChange = (taskName, employeeId) => {
    setTaskAssignments(prev => ({ ...prev, [taskName]: employeeId }));
  };

  const handleAssign = async () => {
    const token = localStorage.getItem('authToken');
    const tasksToAssign = Object.entries(taskAssignments).map(([name, userId]) => ({ name, userId }));

    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/projects/${project._id || 'static'}/assign-task`;
      await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tasks: tasksToAssign })
      });
      alert('Tasks assigned successfully!');
      onClose();
    } catch (error) {
      console.error("Failed to assign tasks", error);
      alert('Failed to assign tasks.');
    }
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="service-modal-header">
          <h2 className="service-modal-title">Assign Tasks for {project.companyName}</h2>
          <button className="service-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="service-modal-body">
          <table className="service-details-table">
            <thead><tr><th>Service Name</th><th>Assign to</th></tr></thead>
            <tbody>
              {(project.serviceName || 'General Task').split(',').map(name => name.trim()).map((serviceName, idx) => (
                <tr key={idx}>
                  <td>{serviceName || 'General Task'}</td>
                  <td>
                    <select className="employee-select" onChange={(e) => handleSelectChange(serviceName || 'General Task', e.target.value)}>
                      <option value="">Select Employee</option>
                      {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.role})</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="service-modal-footer">
          <button className="service-modal-btn assign" onClick={handleAssign}>Assign</button>
        </div>
      </div>
    </div>
  );
};

export default TotalProjects;