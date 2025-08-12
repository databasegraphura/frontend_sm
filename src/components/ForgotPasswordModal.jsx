import React, { useState } from 'react';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    // Call your API to send reset link
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fp-overlay">
      <div className="fp-modal">
        <button className="fp-close" onClick={onClose}>×</button>
        <h2 className="fp-title">🔑 Forgot Password</h2>
        <p className="fp-text">Enter your email address and we’ll send you a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="fp-input"
          />
          <button type="submit" className="fp-submit">📩 Send Reset Link</button>
        </form>
        <button className="fp-back" onClick={onClose}>⬅ Back to Login</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
