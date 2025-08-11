import React, { useState, useEffect } from 'react';
import './Salary.css';

const Salary = () => {
  const [initialSalaryData, setInitialSalaryData] = useState([]);
  const [filteredSalaryData, setFilteredSalaryData] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTLName, setSelectedTLName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const [salariesRes, leadersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/salaries`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/users?role=team_lead`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!salariesRes.ok) throw new Error('Failed to fetch salary data.');
        if (!leadersRes.ok) throw new Error('Failed to fetch team leaders.');

        const salariesData = await salariesRes.json();
        const leadersData = await leadersRes.json();

        setInitialSalaryData(salariesData.data.salaries || []);
        setFilteredSalaryData(salariesData.data.salaries || []);
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
    let data = [...initialSalaryData];

    if (selectedMonth) {
      data = data.filter(item => item.month && item.month.toLowerCase() === selectedMonth.toLowerCase());
    }

    if (selectedTLName) {
      data = data.filter(item => item.tlId === selectedTLName);
    }

    setFilteredSalaryData(data);
  };

  if (isLoading) return <div className="loading-message">Loading Salary Data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="salary-page">
      <h1 className="page-title">Salary</h1>

      <div className="search-section">
        <div className="search-filters">
          <select
            className="filter-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <select
            className="filter-dropdown"
            value={selectedTLName}
            onChange={(e) => setSelectedTLName(e.target.value)}
          >
            <option value="">All TL Names</option>
            {teamLeaders.map(leader => (
              <option key={leader._id} value={leader._id}>{leader.name}</option>
            ))}
          </select>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="salary-table-container">
        <table className="salary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>TL Name</th>
              <th>Email ID</th>
              <th>Contact No.</th>
              <th>Month</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaryData.length > 0 ? filteredSalaryData.map((employee) => (
              <tr key={employee._id}>
                <td className="bold-text">{employee.name}</td>
                <td className="bold-text">{employee.tlName || 'N/A'}</td>
                <td>{employee.email}</td>
                <td>{employee.contact || 'N/A'}</td>
                <td>{employee.month}</td>
                <td className="amount-text">₹{employee.amount.toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan="6">No salary data found for the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;