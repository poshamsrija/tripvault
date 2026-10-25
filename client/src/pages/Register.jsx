
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await api.post("/api/auth/register", {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(
        response.data.message || "Registration successful!"
      );

      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Server response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          `Request failed: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">✈</span>
          <span>TripVault</span>
        </div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start saving your journeys and travel memories.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="e.g. srija_123"
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]{3,30}"
              title="Use 3–30 letters, numbers, or underscores."
              required
            />
            <small>
              Use 3–30 letters, numbers, or underscores.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Create a password"
              required
            />
          </div>

          {success && (
            <p className="success-message" role="status">
              {success}
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        {success && (
          <button
            className="btn btn-secondary auth-submit"
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to login
          </button>
        )}
      </section>
    </main>
  );
}

export default Register;
