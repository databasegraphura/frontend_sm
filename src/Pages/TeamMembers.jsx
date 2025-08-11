import React, { useState, useEffect } from 'react';
import './TeamMembers.css';

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'executive', // Default role
    contact: '',
    bankName: '',
    email: '',
    accountNo: '',
    location: '',
    ifscCode: '',
    joiningDate: '',
    upiId: '',
    password: 'password123', // Default password for new users
    passwordConfirm: 'password123',
    refId: 'default' // Default refId
  });

  // Fetch all users on component mount
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users`;
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch team members.');
      const data = await response.json();
      setTeamMembers(data.data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add new member.');
      }
      // Refresh the list to show the new member
      fetchTeamMembers();
      // Reset form
      setFormData({
        name: '', role: 'executive', contact: '', bankName: '',
        email: '', accountNo: '', location: '', ifscCode: '',
        joiningDate: '', upiId: '', password: 'password123',
        passwordConfirm: 'password123', refId: 'default'
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedMember) return;
    const token = localStorage.getItem('authToken');
    if (window.confirm(`Are you sure you want to delete ${selectedMember.name}?`)) {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/${selectedMember._id}`;
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete member.');
        // Refresh list after deletion
        fetchTeamMembers();
        handleCloseModal();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) return <div className="loading-message">Loading Team Members...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="team-members-container">
      <h1 className="team-members-title">Team Members</h1>

      <div className="team-members-table-container">
        <table className="team-members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Email ID</th>
              <th>Contact No.</th>
              <th>Joining Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member._id} onClick={() => handleMemberClick(member)}>
                <td className="bold-text">{member.name}</td>
                <td>{member.location || 'N/A'}</td>
                <td>{member.email}</td>
                <td>{member.contact || 'N/A'}</td>
                <td>{formatDate(member.joiningDate)}</td>
                <td>
                  <span className={`status-badge ${member.active ? 'active' : 'inactive'}`}>
                    {member.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="team-member-form">
        <div className="form-row">
          <div className="form-group"><input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} /></div>
          <div className="form-group">
            <select name="role" value={formData.role} onChange={handleInputChange} className="role-select">
              <option value="executive">Executive</option>
              <option value="team_lead">Team Lead</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><input type="text" name="contact" placeholder="Contact No." value={formData.contact} onChange={handleInputChange} /></div>
          <div className="form-group"><input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleInputChange} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} /></div>
          <div className="form-group"><input type="text" name="accountNo" placeholder="Account No." value={formData.accountNo} onChange={handleInputChange} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} /></div>
          <div className="form-group"><input type="text" name="ifscCode" placeholder="IFSC Code" value={formData.ifscCode} onChange={handleInputChange} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><input type="date" name="joiningDate" placeholder="Joining Date" value={formData.joiningDate} onChange={handleInputChange} /></div>
          <div className="form-group"><input type="text" name="upiId" placeholder="UPI ID" value={formData.upiId} onChange={handleInputChange} /></div>
        </div>
        <div className="form-actions">
          <button className="add-button" onClick={handleAddMember}>ADD MEMBER</button>
        </div>
      </div>

      {isModalOpen && selectedMember && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedMember.name}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-left">
                <h3 className="section-title">Bank Details</h3>
                <div className="form-field"><label>Bank Name</label><input type="text" value={selectedMember.bankName || ''} readOnly /></div>
                <div className="form-field"><label>IFSC Code</label><input type="text" value={selectedMember.ifscCode || ''} readOnly /></div>
                <div className="form-field"><label>Account No.</label><input type="text" value={selectedMember.accountNo || ''} readOnly /></div>
                <div className="form-field"><label>UPI ID</label><input type="text" value={selectedMember.upiId || ''} readOnly /></div>
              </div>
              <div className="modal-right">
                <div className="payout-info">
                  <div className="payout-row"><span className="payout-label">Current Month Payout:</span><span className="payout-value">{selectedMember.currentMonthPayout || 'N/A'}</span></div>
                  <div className="payout-row"><span className="payout-label">Total Payout:</span><span className="payout-value">{selectedMember.totalPayout || 'N/A'}</span></div>
                </div>
                <div className="status-section">
                  <span className="status-label">Status</span>
                  <span className={`status-badge ${selectedMember.active ? 'active' : 'inactive'}`}>{selectedMember.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="modal-actions">
                  <button className="action-btn update">Update Profile</button>
                  <button className="action-btn close" onClick={handleCloseModal}>Close</button>
                  <button className="action-btn delete" onClick={handleDeleteProfile}>Delete Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
