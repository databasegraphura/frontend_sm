import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [navigate]);

  const handleStayLoggedIn = () => {
    navigate('/dashboard');
  };

  const handleLogoutNow = () => {
    navigate('/login');
  };

  return (
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-icon">🔒</div>
        <h1 className="logout-title">You are being logged out</h1>
        <p className="logout-message">
          Thank you for using the Sales Management System. Your session is being securely terminated. All unsaved changes may be lost.
        </p>
        
        <div className="logout-actions">
          <button className="btn btn-secondary" onClick={handleStayLoggedIn}>
            Stay Logged In
          </button>
          <button className="btn btn-primary" onClick={handleLogoutNow}>
            Logout Now
          </button>
        </div>
        
        <p className="countdown">
          Automatic logout in <span className="timer">{timeLeft}</span> seconds
        </p>
      </div>
    </div>
  );
};

export default Logout;