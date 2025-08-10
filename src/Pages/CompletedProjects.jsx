import React, { useState, useEffect } from 'react';

const CompletedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/executive/completed-projects`;
        const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Failed to fetch completed projects.');
        const data = await response.json();
        setProjects(data.data.projects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) return <div>Loading completed projects...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>My Completed Projects</h1>
      {projects.length > 0 ? (
        <div>
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Service</th>
                <th>Completed On</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td><b>{p.companyName}</b></td>
                  <td>{p.serviceName}</td>
                  <td><b>{new Date(p.endDate).toLocaleDateString()}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have no completed projects.</p>
      )}
    </div>
  );
};

export default CompletedProjects;