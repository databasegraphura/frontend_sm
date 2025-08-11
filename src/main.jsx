import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

// Create a root for the React application
const root = ReactDOM.createRoot(rootElement);

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);