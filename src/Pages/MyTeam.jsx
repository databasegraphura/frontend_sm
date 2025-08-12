import React, { useState, useEffect } from 'react';
import './MyTeam.css';

const MyTeam = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/teams`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch your teams.');
        const data = await response.json();
        setTeams(data.data.teams || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (isLoading) return <div className="loading-message">Loading Your Teams...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-team-page">
      <h1 className="page-title">My Team</h1>
      {teams.length > 0 ? (
        teams.map(team => (
          <div key={team._id} className="team-card">
            <h2 className="team-name">{team.name}</h2>
            <p className="team-description">{team.description}</p>
            <h3 className="members-title">Executives</h3>
            {team.executives && team.executives.length > 0 ? (
              <ul className="members-list">
                {team.executives.map(member => (
                  <li key={member._id} className="member-item">
                    <span className="member-name">{member.name}</span>
                    <span className="member-email">{member.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No executives in this team.</p>
            )}
          </div>
        ))
      ) : (
        <p className="no-data-message">You are not assigned to any teams.</p>
      )}
    </div>
  );
};

export default MyTeam;