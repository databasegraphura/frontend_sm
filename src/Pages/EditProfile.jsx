import React, { useState, useEffect } from 'react';
import './EditProfile.css';

const EditProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({ name: '', email: '', contact: '', location: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const token = localStorage.getItem('authToken');

    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/users/updateMe`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile.');
      
      showAlert('success', 'Profile updated successfully!');
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showAlert('error', 'New passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    const token = localStorage.getItem('authToken');

    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/users/updateMyPassword`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          passwordCurrent: passwordData.currentPassword,
          password: passwordData.newPassword,
          passwordConfirm: passwordData.confirmNewPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update password.');

      showAlert('success', 'Password updated successfully! Please log in again.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1 className="profile-header">My Profile</h1>

      {alert.message && <div className={`alert-message alert-${alert.type}`}>{alert.message}</div>}

      <div className="profile-section">
        <h2 className="section-title">Personal Information</h2>
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" value={profileData.name} onChange={handleProfileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input id="contact" name="contact" type="tel" value={profileData.contact} onChange={handleProfileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" type="text" value={profileData.location} onChange={handleProfileChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Change Password</h2>
        <form className="profile-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input id="currentPassword" name="currentPassword" type="password" placeholder="••••••••" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="form-group"></div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" name="newPassword" type="password" placeholder="••••••••" value={passwordData.newPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input id="confirmNewPassword" name="confirmNewPassword" type="password" placeholder="••••••••" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={isSavingPassword}>
              {isSavingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;