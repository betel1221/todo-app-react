import React, { useState } from 'react';
import Input from './Input.jsx'; // Ensure .jsx

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dummyUserData = { username: "Awesome User", email: email };
    onLogin(dummyUserData, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="login@gmail.com" // Matches your image
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="**********"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-visibility"
          >
            {/* Make sure you have Material Icons loaded in your index.html */}
            <span className="material-icons">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <div className="form-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <a href="#" className="forgot-password-link">Forgot Password?</a>
      </div>

      <button type="submit" className="login-button">
        LOGIN
        {/* Add an arrow icon next to LOGIN if desired, assuming Material Icons */}
        <span className="material-icons">arrow_forward</span>
      </button>
    </form>
  );
};

export default LoginForm;