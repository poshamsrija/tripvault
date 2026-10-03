
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login to Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Enter email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Enter password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging..." : "Login"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default Login;