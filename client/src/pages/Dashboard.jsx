
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        const response = await api.get("/api/auth/me");
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
        setTrips(response.data.trips || []);
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
    window.location.replace("/login");
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

      <nav>
        {user?.username ? (
          <Link to={`/profile/${user.username}`}>
            My Profile
          </Link>
        ) : (
          <p>
            Username unavailable. Please check your account details.
          </p>
        )}

        {" | "}

        <Link to="/trips/new">Create Trip</Link>

        {" | "}

        <button onClick={handleLogout}>Logout</button>
      </nav>

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
              {trip.coverImage ? (
                <img
                  src={trip.coverImage}
                  alt={`Cover of ${trip.title}`}
                  width="320"
                  style={{
                    maxWidth: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "320px",
                    maxWidth: "100%",
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "8px",
                  }}
                >
                  No cover photo yet
                </div>
              )}

              <h3>
                <Link to={`/trips/${trip._id}`}>
                  {trip.title}
                </Link>
              </h3>

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

              <p>
                <Link to={`/trips/${trip._id}`}>
                  View Trip &amp; Photos →
                </Link>
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
