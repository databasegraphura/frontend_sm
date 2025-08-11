import React, { useState, useEffect } from 'react';
import './Review.css';

const ReviewSection = ({ review, onApprove, onReject }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const project = review.project || {};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-CA'); 
  };

  return (
    <div className="company-section">
      <div className="company-header">
        <div className="company-info">
          <span className="company-name">{project.companyName || 'N/A'}</span>
        </div>
        <div className="invoice-info">
          <span className="invoice-label">Invoice no.</span>
          <div className="invoice-dropdown-container">
            <div className="invoice-dropdown" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              {project.invoiceNumber || 'N/A'}
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </div>

      <div className="review-form">
        <div className="form-row">
          <div className="form-group"><label>Client Name</label><input type="text" value={project.clientName || ''} readOnly /></div>
          <div className="form-group"><label>Designation</label><input type="text" value={project.designation || ''} readOnly /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Contact No.</label><input type="text" value={project.contactNumber || ''} readOnly /></div>
          <div className="form-group"><label>Email ID</label><input type="email" value={project.email || ''} readOnly /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Start Date</label><input type="date" value={formatDate(project.startDate)} readOnly /></div>
          <div className="form-group"><label>End Date</label><input type="date" value={formatDate(project.endDate)} readOnly /></div>
        </div>
        <div className="form-row">
          <div className="form-group full-width"><label>Service Name(s)</label><input type="text" value={project.serviceName || ''} readOnly /></div>
        </div>

        <div className="company-details">
          <h3 className="details-title">Company Details</h3>
          <div className="details-table">
            <div className="table-header">
              <div className="header-cell">Service</div>
              <div className="header-cell">Actions</div>
            </div>
            {project.serviceName && project.serviceName.split(',').map((service, idx) => (
              <div className="table-row" key={idx}>
                <div className="service-cell">{service.trim()}</div>
                <div className="actions-cell">
                  <button className="action-btn video-btn">Video</button>
                  <button className="action-btn download-btn">Download</button>
                  <button className="action-btn upload-btn">Upload</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-approve" onClick={() => onApprove(review._id)}>Approve</button>
          <button className="btn btn-reject" onClick={() => onReject(review._id)}>Reject</button>
        </div>
      </div>
    </div>
  );
};


const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/reviews`;
      const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to fetch reviews.');
      const data = await response.json();

      setReviews(data.data.reviews.filter(r => r.status === 'pending'));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewAction = async (reviewId, status) => {
    const token = localStorage.getItem('authToken');
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/reviews/${reviewId}`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} the review.`);
      }

      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));

    } catch (error) {
      alert(error.message);
    }
  };

  const handleApprove = (reviewId) => handleReviewAction(reviewId, 'approved');
  const handleReject = (reviewId) => handleReviewAction(reviewId, 'rejected');

  if (isLoading) return <div className="loading-message">Loading Reviews...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="review">
      <h1 className="section-title">Review Pending Projects</h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewSection
            key={review._id}
            review={review}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))
      ) : (
        <p className="no-data-message">There are no pending reviews at the moment.</p>
      )}
    </div>
  );
};

export default Review;