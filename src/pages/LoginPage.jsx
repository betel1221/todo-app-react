import React from 'react';
import LoginForm from './LoginForm.jsx';
import { useTheme } from '../context/ThemeContext.jsx'; // Ensure .jsx extension

import './LoginPage.css'; // Import the CSS file

// Assuming your 3D illustration is in public/character-cactus.png
const characterIllustrationPath = '/alligator.jpg'; // Or whatever your image filename is

const LoginPage = ({ onLogin }) => {
  const { theme } = useTheme();

  return (
    <div className={`login-page-container ${theme}-theme`}>
      <div className="login-card">
        {/* Left Section: Login Form */}
        <div className="login-form-section">
          <div className="login-header-content">
            <h1 className="logo-text">Logo Here</h1>
            <p className="welcome-back-text">Welcome back !!!</p>
            <h2 className="login-title">Log In</h2>
          </div>

          <LoginForm onLogin={onLogin} />

          {/* Social Login Options */}
          <p className="or-divider">or continue with</p>
          <div className="social-buttons">
            <button className="social-button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_Google_2020_-_Icon_only.svg" alt="Google" />
              Google
            </button>
            <button className="social-button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" />
              GitHub
            </button>
            {/* Add other social login buttons as needed, e.g., for Facebook */}
            <button className="social-button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
              Facebook
            </button>
          </div>
          <p className="signup-link-container">
            Don't have an account yet? <a href="#" className="signup-link">Sign up for free</a>
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="login-image-section">
          <img
            src={characterIllustrationPath}
            alt="Character with laptop and cactus"
            className="login-illustration-image"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;