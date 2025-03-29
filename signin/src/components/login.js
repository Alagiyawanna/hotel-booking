import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      
      // Store user info and token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.result));
      
      alert("Login successful");
      navigate('/'); // Redirect to home page
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="form-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="submit-button">
          Login
        </button>
        <Link to="/signup" className="signup-link">
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
};

export default Login;