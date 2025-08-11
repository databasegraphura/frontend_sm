import React, { useState, useEffect } from 'react';
import './MyProjects.css';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/executive/my-projects`;
                const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
                if (!response.ok) throw new Error('Failed to fetch your projects.');
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

    if (isLoading) return <div>Loading your projects...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="page">
            <h1 className="section-title">My Current & Pending Projects</h1>
            {projects.length > 0 ? (
                <div className="projects-table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Service</th>
                                <th>Deadline</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p._id}>
                                    <td><b>{p.companyName}</b></td>
                                    <td>{p.serviceName}</td>
                                    <td><b>{new Date(p.endDate).toLocaleDateString()}</b></td>
                                    <td>{p.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>You have no current or pending projects.</p>
            )}
        </div>
    );
};

export default MyProjects;