import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onToggleSidebar, activeButton, onHeaderButtonClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = (buttonId, path) => {
    onHeaderButtonClick(buttonId);
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  const handleProfileClick = () => {
    navigate('/edit-profile');
  };

  return (
    <header className="header">
      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        <span />
        <span />
        <span />
      </button>
      
      <div className="header-actions">
        <button 
          className={`action-btn ${activeButton === 'proposals-btn' ? 'active' : ''}`}
          onClick={() => handleButtonClick('proposals-btn', '/proposals')}
        >
          Proposals <span className="btn-badge">5</span>
        </button>
        
        <button 
          className={`action-btn ${activeButton === 'custom-plan-btn' ? 'active' : ''}`}
          onClick={() => handleButtonClick('custom-plan-btn', '/custom-plan')}
        >
          Custom Plan <span className="btn-badge">3</span>
        </button>
        
        <button 
          className={`action-btn ${activeButton === 'work-order-btn' ? 'active' : ''}`}
          onClick={() => handleButtonClick('work-order-btn', '/work-order')}
        >
          Work Order <span className="btn-badge new">New</span>
        </button>
        
        <button 
          className="profile-btn" 
          onClick={handleProfileClick}
          type="button"
        >
          👤 My Profile
        </button>
      </div>
    </header>
  );
};

export default Header;