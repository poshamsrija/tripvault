
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
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
  
useEffect(() => {
  const fetchTrips = async () => {
    try {
      const response = await api.get("/api/trips");
      setTrips(response.data.trips);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      console.error("Failed to fetch trips:", err);
    } finally {
      setTripsLoading(false);
    }
  };

  fetchTrips();
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

    <hr />

    <h2>My Trips</h2>

    {tripsLoading ? (
      <p>Loading trips...</p>
    ) : trips.length === 0 ? (
      <p>No trips yet. Add your first trip soon!</p>
    ) : (
      <div>
        {trips.map((trip) => (
          <div key={trip._id}>
            <h3>{trip.title}</h3>
            <p>Destination: {trip.destination}</p>

            {trip.startDate && (
              <p>
                Start date:{" "}
                {new Date(trip.startDate).toLocaleDateString()}
              </p>
            )}

            {trip.endDate && (
              <p>
                End date:{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </p>
            )}

            {trip.description && <p>{trip.description}</p>}

            {trip.rating != null && (
              <p>Rating: {trip.rating}/5</p>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

}

export default Dashboard;