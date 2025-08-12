import React, { useState, useEffect } from 'react';
import './TransferDataToFDBK.css';

const TransferDataToFDBK = () => {
  const [receivedData, setReceivedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCompanies, setExpandedCompanies] = useState({});

  
    const fetchReceivedData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/received-data`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch received data for transfer.');
        }

        const data = await response.json();
        setReceivedData(data.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
    fetchReceivedData();
  }, []);

  const toggleCompany = (companyId) => {
    setExpandedCompanies(prev => ({ ...prev, [companyId]: !prev[companyId] }));
  };

  const handleTransfer = (companyId) => {
    alert(`Transfer initiated for company ID: ${companyId}`);
    console.log('Transferring data for:', companyId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  if (isLoading) return <div className="loading-message">Loading Data for Transfer...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="transfer-data-fdbk">
      <h1 className="page-title">Transfer Data to Feedback</h1>

      <div className="search-section">
        <div className="date-search">
          <select className="date-dropdown">
            <option value="">Filter by Date</option>
            <option value="today">Today</option>
            <option value="this-month">This Month</option>
          </select>
          <button className="search-btn">Search</button>
        </div>
      </div>

      {receivedData.length > 0 ? receivedData.map((item, index) => (
        <div key={item._id} className="company-section">
          <div
            className={`company-header ${expandedCompanies[item._id] ? 'expanded' : ''}`}
            onClick={() => toggleCompany(item._id)}
          >
            <div className="company-info">
              <span className="company-number">{index + 1}.</span>
              <span className="company-name">{item.companyName}</span>
            </div>
            <div className="invoice-section">
              <span className="invoice-text">Invoice: {item.invoiceNumber}</span>
              <div className="dropdown-arrow">▼</div>
            </div>
          </div>

          <div className={`company-content ${expandedCompanies[item._id] ? 'expanded' : ''}`}>
            <div className="company-form">
              <div className="form-group"><label>Client Name</label><input type="text" value={item.clientName || ''} readOnly /></div>
              <div className="form-group"><label>Designation</label><input type="text" value={item.designation || ''} readOnly /></div>
              <div className="form-group"><label>Contact No.</label><input type="text" value={item.contactNumber || ''} readOnly /></div>
              <div className="form-group"><label>Email ID</label><input type="email" value={item.email || ''} readOnly /></div>
              <div className="form-group"><label>Start Date</label><input type="date" value={formatDate(item.startDate)} readOnly /></div>
              <div className="form-group"><label>End Date</label><input type="date" value={formatDate(item.endDate)} readOnly /></div>
              <div className="form-group full-width"><label>Service Name(s)</label><input type="text" value={item.serviceName || ''} readOnly /></div>
            </div>

            <button className="transfer-btn" onClick={() => handleTransfer(item._id)}>
              Transfer
            </button>

            <div className="company-details">
              <h3>Company Details</h3>
              <div className="services-table">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.serviceName && item.serviceName.split(',').map((service, idx) => (
                      <tr key={idx}>
                        <td className="service-name">{service.trim()}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn blue">Video</button>
                            <button className="action-btn blue">Download</button>
                            <button className="action-btn green">Upload</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <p className="no-data-message">No data available to transfer.</p>
      )}
    </div>
  );
};

export default TransferDataToFDBK;
