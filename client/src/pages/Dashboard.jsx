
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripsError, setTripsError] = useState("");

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
            "Unable to load your profile. Please try again."
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

        setTripsError(
          err.response?.data?.message ||
            "Unable to load your trips. Please refresh the page."
        );
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
    return (
      <main className="dashboard-page">
        <div className="page-container">
          <p>Loading your TripVault dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="page-container">
          <p className="error-message" role="alert">{error}</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/dashboard" className="dashboard-logo">
          <span className="auth-brand-icon">✈</span>
          TripVault
        </Link>

        <nav className="dashboard-nav" aria-label="Main navigation">
          {user?.username && (
            <Link to={`/profile/${user.username}`}>My Profile</Link>
          )}

          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="page-container">
        <section className="dashboard-welcome">
          <p className="dashboard-eyebrow">YOUR TRAVEL JOURNAL</p>
          <h1>Welcome back, {user?.name || "Traveler"}!</h1>
          <p className="dashboard-description">
            Every journey has a story. Keep your adventures safe in one place.
          </p>

          {user?.email && (
            <p className="dashboard-email">{user.email}</p>
          )}

          <Link to="/trips/new" className="btn btn-primary">
            + Create a Trip
          </Link>
        </section>

        <section className="trips-section">
          <div className="trips-heading">
            <div>
              <h2>My Adventures</h2>
              <p>All your saved journeys, together.</p>
            </div>

            <span className="trip-count">
              {trips.length} {trips.length === 1 ? "trip" : "trips"}
            </span>
          </div>

          {tripsLoading ? (
            <div className="dashboard-message" role="status">
              Loading your trips...
            </div>
          ) : tripsError ? (
            <div className="dashboard-message">
              <p className="error-message" role="alert">{tripsError}</p>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : trips.length === 0 ? (
            <div className="empty-trips">
              <div className="empty-trips-icon">🌍</div>
              <h3>Your next adventure starts here</h3>
              <p>
                You haven't saved any trips yet. Create your first trip
                and start collecting your travel memories.
              </p>
              <Link to="/trips/new" className="btn btn-primary">
                Create your first trip
              </Link>
            </div>
          ) : (
            <div className="trip-grid">
              {trips.map((trip) => (
                <article className="trip-card" key={trip._id}>
                  <Link
                    to={`/trips/${trip._id}`}
                    className="trip-card-image-link"
                    aria-label={`View ${trip.title}`}
                  >
                    {trip.coverImage ? (
                      <img
                        className="trip-card-image"
                        src={trip.coverImage}
                        alt={`Cover of ${trip.title}`}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="trip-card-placeholder">
                        <span>✈</span>
                        <span>No cover photo yet</span>
                      </div>
                    )}
                  </Link>

                  <div className="trip-card-content">
                    <p className="trip-card-destination">
                      📍 {trip.destination}
                    </p>

                    <h3>
                      <Link to={`/trips/${trip._id}`}>
                        {trip.title}
                      </Link>
                    </h3>

                    {(trip.startDate || trip.endDate) && (
                      <p className="trip-card-dates">
                        {trip.startDate
                          ? new Date(trip.startDate).toLocaleDateString()
                          : "Start date not set"}
                        {" — "}
                        {trip.endDate
                          ? new Date(trip.endDate).toLocaleDateString()
                          : "End date not set"}
                      </p>
                    )}

                    {trip.description && (
                      <p className="trip-card-description">
                        {trip.description}
                      </p>
                    )}

                    {trip.rating != null && (
                      <p className="trip-card-rating">
                        ⭐ {trip.rating}/5
                      </p>
                    )}

                    <Link
                      to={`/trips/${trip._id}`}
                      className="trip-card-link"
                    >
                      View trip & photos →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="dashboard-footer">
        Made for your next adventure · TripVault
      </footer>
    </main>
  );
}

export default Dashboard;
