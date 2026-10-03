
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user || response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <button onClick={handleLogout}>Back to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to TripVault</h1>
      <p>Hello, {user?.name || "Traveler"}!</p>
      <p>Email: {user?.email || "Not available"}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;