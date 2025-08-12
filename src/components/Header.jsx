import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  const handleProfileClick = () => {
    navigate('/edit-profile');
  };

  return (
    <header className="header">
      <button className={`sidebar-toggle ${!sidebarOpen ? 'closed' : ''}`} onClick={onToggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <div className="header-actions">
        <button 
          className="action-btn"
          onClick={() => handleButtonClick('/proposals')}
        >
          Proposals <span className="btn-badge">5</span>
        </button>
        
        <button 
          className="action-btn"
          onClick={() => handleButtonClick('/custom-plan')}
        >
          Custom Plan <span className="btn-badge">3</span>
        </button>
        
        <button 
          className="action-btn"
          onClick={() => handleButtonClick('/work-order')}
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