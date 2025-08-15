import React, { Component } from "react";
import Cookie from "js-cookie";
import { Navigate } from "react-router-dom";
import "./Login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errorMsg: "",
    loading: false,
    isLoggedIn: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async () => {
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ errorMsg: "Please enter both email and password." });
      return;
    }

    this.setState({ loading: true, errorMsg: "" });

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.setState({ errorMsg: data.message || "Login failed" });
      } else {
        Cookie.set("jwt_token", data.jwt_token, { expires: 7 });
        this.setState({ isLoggedIn: true });
      }
    } catch {
      this.setState({ errorMsg: "Network error. Please try again later." });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { email, password, errorMsg, loading, isLoggedIn } = this.state;

    if (isLoggedIn) {
      return <Navigate to="/home" replace />;
    }

    return (
      <div className="full-center-wrapper">
        <div className="login-container">
          <div className="illustration">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
              alt="Shopping Illustration"
            />
          </div>
          <div className="login-form">
            <h1>
               ATELIER<span className="highlight"> LUXE</span>
            </h1>
            <div className="input-group">
              <label>EMAIL</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="Email"
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            <button
              className="login-btn"
              onClick={this.handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
