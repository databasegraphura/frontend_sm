import React, { useState, useEffect } from 'react';
import './TotalProjects.css';

const TotalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProjects, setExpandedProjects] = useState({});
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
          // --- FIX: Access the correct data path ---
          setProjects(data.data.data || []);
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

  const handleAssignProjectClick = (project) => {
    setSelectedProject(project);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedProject(null);
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

      {projects.length > 0 ? projects.map((project, index) => (
        <div key={project._id} className="project-section">
          <div
            className={`project-header ${expandedProjects[project._id] ? 'expanded' : ''}`}
            onClick={() => toggleProject(project._id)}
          >
            <div className="project-title">{index + 1}. {project.companyName || 'N/A'}</div>
            <div className="project-header-right">
              <div className="project-invoice">Invoice: {project.invoiceNumber || 'N/A'}</div>
              <div className="project-toggle">{expandedProjects[project._id] ? '▲' : '▼'}</div>
            </div>
          </div>

          <div className={`project-content ${expandedProjects[project._id] ? 'expanded' : ''}`}>
            <div className="client-form">
              {/* Added the missing fields from your API response */}
              <div className="form-group"><label>Client Name</label><input type="text" value={project.clientName || ''} readOnly /></div>
              <div className="form-group"><label>Designation</label><input type="text" value={project.designation || 'N/A'} readOnly /></div>
              <div className="form-group"><label>Contact No.</label><input type="tel" value={project.contactNumber || 'N/A'} readOnly /></div>
              <div className="form-group"><label>Email ID</label><input type="email" value={project.email || ''} readOnly /></div>
              <div className="form-group"><label>Start Date</label><input type="date" value={formatDate(project.startDate)} readOnly /></div>
              <div className="form-group"><label>End Date</label><input type="date" value={formatDate(project.endDate)} readOnly /></div>
              <div className="form-group full-width"><label>Service Name</label><input type="text" value={project.serviceName || ''} readOnly /></div>
            </div>

            <button className="assign-project-btn" onClick={() => handleAssignProjectClick(project)}>Assign Project Tasks</button>

            <div className="company-details">
              <h3>Service Tasks</h3>
              <div className="service-table">
                <table>
                  <thead>
                    <tr>
                      <th>Service Task</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.tasks && project.tasks.length > 0 ? project.tasks.map(task => (
                      <tr key={task._id}>
                        <td>{task.name}</td>
                        <td>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</td>
                        <td><span className={`status-badge status-${task.status?.toLowerCase()}`}>{task.status}</span></td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn blue">Details</button>
                            <button className="action-btn green">Upload</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4">No tasks assigned for this project yet.</td></tr>
                    )}
                  </tbody>
                </table>
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
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/projects/${project._id}/assign-task`;
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
              {(project.serviceName || '').split(',').map(name => name.trim()).map((serviceName, idx) => (
                <tr key={idx}>
                  <td>{serviceName}</td>
                  <td>
                    <select className="employee-select" onChange={(e) => handleSelectChange(serviceName, e.target.value)}>
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