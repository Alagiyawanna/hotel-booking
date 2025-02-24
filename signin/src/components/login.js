import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      console.log(response.data);
      alert("Login successful");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data.message);
        alert(error.response.data.message);
      } else {
        console.error("An error occurred:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="form-title">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
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