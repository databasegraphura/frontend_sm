import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import logo from "src/Assets/logo.png";
import { FaChartLine, FaUsers, FaFileAlt, FaExchangeAlt } from "react-icons/fa";
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx';

// Main Component for the Login/Signup page
const LoginPage = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-sidebar">
          <div className="auth-logo">
            <img src={logo} alt="Graphura Logo" className="auth-logo-icon" />
          </div>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon"><FaChartLine /></span>
              <span className="auth-feature-text">Track sales performance in real-time</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon"><FaUsers /></span>
              <span className="auth-feature-text">Manage your team efficiently</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon"><FaFileAlt /></span>
              <span className="auth-feature-text">Generate comprehensive reports</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon"><FaExchangeAlt /></span>
              <span className="auth-feature-text">Seamless data transfer capabilities</span>
            </div>
          </div>
          <div className="auth-sidebar-footer">
            &copy; 2024 Graphura. All rights reserved.
          </div>
        </div>
        <div className="auth-form-container">
          {isLoginView ? (
            <LoginForm onLogin={onLogin} switchToSignup={() => setIsLoginView(false)} />
          ) : (
            <SignupForm switchToLogin={() => setIsLoginView(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ onLogin, switchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/login`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login. Please check your credentials.');
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      if (onLogin) {
        onLogin(data.data.user, data.token);
        if (data.data.user.role === 'executive') {
          navigate('/my-projects');
        } else {
          navigate('/dashboard');
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">Please enter your credentials to access your account</p>
      </div>

      {error && <div className="auth-error-message">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <input
            type="email"
            id="login-email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot password?
      </p>

      {/* Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      )}

        <button
          type="submit"
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="signup-link">
          Don't have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); switchToSignup(); }}>
            Sign up
          </a>
        </div>
      </form>

      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </>
  );
};

// Signup Form Component
const SignupForm = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    refId: '',
    role: 'executive',
    department: 'sales',
    password: '',
    passwordConfirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Construct the full API URL from the .env variable
      const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/signup`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account.');
      }

      setSuccess('Account created successfully! Please log in.');
      setTimeout(() => {
        switchToLogin();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Get started by creating your new account</p>
      </div>

      {error && <div className="auth-error-message">{error}</div>}
      {success && <div className="auth-success-message">{success}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" className="form-input" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">Email Address</label>
          <input type="email" id="signup-email" name="email" className="form-input" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="refId">Reference ID</label>
          <input type="text" id="refId" name="refId" className="form-input" placeholder="Enter your reference ID" value={formData.refId} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="role">Role</label>
          <select id="role" name="role" className="form-input" value={formData.role} onChange={handleInputChange} required>
            <option value="executive">Executive</option>
            <option value="team_lead">Team Lead</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="department">Department</label>
          <select id="department" name="department" className="form-input" value={formData.department} onChange={handleInputChange} required>
            <option value="sales">Sales</option>
            <option value="management">Management</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" name="password" className="form-input" placeholder="Create a strong password" value={formData.password} onChange={handleInputChange} required minLength="8" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="passwordConfirm">Confirm Password</label>
          <input type="password" id="passwordConfirm" name="passwordConfirm" className="form-input" placeholder="Confirm your password" value={formData.passwordConfirm} onChange={handleInputChange} required />
        </div>
        <button type="submit" className={`auth-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <div className="signup-link">
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Sign in</a>
        </div>
      </form>
    </>
  );
};

export default LoginPage;