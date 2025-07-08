import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate hook

    // Effect to pre-fill username if "Remember Me" was checked
    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        const storedRememberMe = localStorage.getItem('rememberMe');
        if (storedRememberMe === 'true' && storedUser) {
            setUsername(storedUser);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        setUsernameError('');
        setPasswordError('');

        let isValid = true;

        if (username.trim() === '') {
            setUsernameError('Username or Email is required.');
            isValid = false;
        }
        if (password.trim() === '') {
            passwordError.textContent = 'Password is required.'; // Keep this line for password error
            setPasswordError('Password is required.'); // Update state for React
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const correctUsername = 'user@example.com';
            const correctPassword = 'password123';

            if (username === correctUsername && password === correctPassword) {
                alert('Login Successful!');

                if (rememberMe) {
                    localStorage.setItem('loggedInUser', username);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    sessionStorage.setItem('loggedInUser', username);
                    localStorage.removeItem('loggedInUser');
                    localStorage.removeItem('rememberMe');
                }

                // *** Change this line for React Router navigation ***
                navigate('/dashboard'); // Navigate to the dashboard route
            } else {
                setUsernameError('Incorrect username or password.');
                setPasswordError('Incorrect username or password.');
                alert('Login Failed. Please check your credentials.');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleSocialLogin = (platform) => {
        alert(`${platform} Login is not implemented yet.`);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        alert('Forgot Password feature is not implemented yet.');
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        alert('Sign Up feature is not implemented yet. For now, try: user@example.com / password123');
    };

    return (
        <div className="login-container">
            <h2>Welcome to Your Todo App!</h2>
            <div className="login-box">
                <h3>Login or Sign Up</h3>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">
                            <span className="material-icons">person</span> Username or Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username or email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <p className="error-message">{usernameError}</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <span className="material-icons">lock</span> Password
                        </label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="material-icons password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </div>
                        <p className="error-message">{passwordError}</p>
                    </div>

                    <div className="options-row">
                        <label className="checkbox-container">
                            Remember Me
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                            Forgot Password?
                        </a>
                    </div>

                    <button type="submit" id="login-button" disabled={!username || !password || isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="separator"><span>OR</span></p>

                <div className="social-login">
                    <button className="social-btn google" onClick={() => handleSocialLogin('Google')}>
                        <img src="google.png" alt="Google icon" />
                        Continue with Google
                    </button>
                    <button className="social-btn facebook" onClick={() => handleSocialLogin('Facebook')}>
                        <img src="facebook.png" alt="Facebook icon" />
                        Continue with Facebook
                    </button>
                </div>

                <p className="signup-text">
                    Don't have an account? <a href="#" id="signup-link" onClick={handleSignUp}>Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;