import React, { useState, useEffect } from 'react';
import './TlReview.css';

const TlReview = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ month: '', day: '' });

  const fetchReviews = async () => {
    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }

    try {
      // Build query string from filter state
      const queryParams = new URLSearchParams(filter).toString();
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/tl/reviews?${queryParams}`;
      
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch reviews.');
      }

      const data = await response.json();
      setReviews(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []); // Initial fetch

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = () => {
      fetchReviews();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="tl-review-page">
      <h1 className="page-title">My Reviews</h1>

      <div className="filter-container">
        <input 
            type="number" 
            name="month" 
            placeholder="Month (1-12)" 
            className="filter-input" 
            value={filter.month}
            onChange={handleFilterChange} 
        />
        <input 
            type="number" 
            name="day" 
            placeholder="Day (1-31)" 
            className="filter-input" 
            value={filter.day}
            onChange={handleFilterChange}
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading reviews...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : reviews.length > 0 ? (
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <h3 className="company-name">{review.companyName}</h3>
                <span className="review-date">{formatDate(review.date)}</span>
              </div>
              <div className="review-body">
                <p><strong>Invoice No:</strong> {review.invoiceNo}</p>
                <p><strong>Service:</strong> {review.serviceName}</p>
                <p><strong>Comment:</strong> {review.comment || 'No comment provided.'}</p>
              </div>
              {review.projectFile && (
                <div className="review-footer">
                  <a href={review.projectFile} target="_blank" rel="noopener noreferrer" className="file-link">
                    View Attached File
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-message">No reviews found for the selected criteria.</p>
      )}
    </div>
  );
};

export default TlReview;
