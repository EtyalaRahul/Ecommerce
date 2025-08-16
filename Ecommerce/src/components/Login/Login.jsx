import React, { Component } from "react";
import Cookie from "js-cookie";
import { Navigate } from "react-router-dom";
import "./login.css";

class Login extends Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    gender: "",
    age: "",
    errorMsg: "",
    loading: false,
    isLoggedIn: false,
    isRegister: false, // toggle between Login & Register
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

  handleRegister = async () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      gender,
      age,
    } = this.state;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !password ||
      !gender ||
      !age
    ) {
      this.setState({ errorMsg: "All fields are required" });
      return;
    }

    this.setState({ loading: true, errorMsg: "" });

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          phone_number,
          password,
          gender,
          age,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.setState({ errorMsg: data.message || "Registration failed" });
      } else {
        this.setState({
          errorMsg: "Registration successful! Please login.",
          isRegister: false, // Switch to login
          email: "",
          password: "",
        });
      }
    } catch {
      this.setState({ errorMsg: "Network error. Please try again later." });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      gender,
      age,
      errorMsg,
      loading,
      isLoggedIn,
      isRegister,
    } = this.state;

    if (isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="full-center-wrapper">
        <div className="login-container">
          <div className="illustration">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
              alt="Illustration"
            />
          </div>

          <div className="login-form">
            <h1>
              ATELIER<span className="highlight"> LUXE</span>
            </h1>

            {isRegister ? (
              <>
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={first_name}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={last_name}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={phone_number}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={this.handleChange}
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={age}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                <button
                  className="login-btn"
                  onClick={this.handleRegister}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
                <p className="toggle-text">
                  Already have an account?{" "}
                  <span
                    className="toggle-link"
                    onClick={() => this.setState({ isRegister: false })}
                  >
                    Login here
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    disabled={loading}
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
                <p className="toggle-text">
                  Don’t have an account?{" "}
                  <span
                    className="toggle-link"
                    onClick={() => this.setState({ isRegister: true })}
                  >
                    Register here
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
