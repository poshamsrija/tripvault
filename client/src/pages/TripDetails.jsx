
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/trips/${id}`);

        if (!cancelled) {
          setTrip(response.data.trip || response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load this trip. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrip();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-container">
          <div className="trip-details-message" role="status">
            <span className="trip-details-loading-icon">✈</span>
            <h2>Loading your adventure...</h2>
            <p>Getting your travel memories ready.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-container">
          <div className="trip-details-message">
            <h2>Couldn't load this trip</h2>
            <p className="error-message" role="alert">{error}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-container">
          <div className="trip-details-message">
            <h2>Trip not found</h2>
            <p>This trip may have been removed or is unavailable.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const photos = [
    ...(trip.coverImage ? [trip.coverImage] : []),
    ...(trip.photos || []),
  ].filter((url, index, all) => all.indexOf(url) === index);

  return (
    <main className="trip-details-page">
      <header className="create-trip-header">
        <Link to="/dashboard" className="dashboard-logo">
          <span className="auth-brand-icon">✈</span>
          TripVault
        </Link>

        <Link to="/dashboard" className="back-dashboard-link">
          ← Dashboard
        </Link>
      </header>

      <div className="trip-details-container">
        <Link to="/dashboard" className="trip-details-back">
          ← Back to My Adventures
        </Link>

        <section className="trip-details-card">
          {trip.coverImage ? (
            <img
              className="trip-details-cover"
              src={trip.coverImage}
              alt={`Cover of ${trip.title}`}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="trip-details-cover-placeholder">
              <span>🌍</span>
              <p>Your adventure, your story</p>
            </div>
          )}

          <div className="trip-details-content">
            <p className="dashboard-eyebrow">YOUR TRAVEL JOURNAL</p>

            <h1>{trip.title}</h1>

            <p className="trip-details-destination">
              <span aria-hidden="true">📍</span> {trip.destination}
            </p>

            <div className="trip-details-meta">
              {trip.startDate && (
                <div className="trip-meta-item">
                  <span className="trip-meta-label">START DATE</span>
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {trip.endDate && (
                <div className="trip-meta-item">
                  <span className="trip-meta-label">END DATE</span>
                  <span>
                    {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {trip.rating != null && (
                <div className="trip-meta-item">
                  <span className="trip-meta-label">YOUR RATING</span>
                  <span>⭐ {trip.rating}/5</span>
                </div>
              )}
            </div>

            {trip.description && (
              <section className="trip-details-description">
                <h2>About this adventure</h2>
                <p>{trip.description}</p>
              </section>
            )}
          </div>
        </section>

        <section className="trip-gallery-section">
          <div className="trip-gallery-heading">
            <div>
              <h2>Travel Memories</h2>
              <p>Moments captured along the way.</p>
            </div>

            <span className="trip-count">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </span>
          </div>

          {photos.length === 0 ? (
            <div className="trip-gallery-empty">
              <span>📷</span>
              <h3>Your gallery is waiting</h3>
              <p>
                There are no photos for this trip yet. Your travel
                memories will appear here when photos are available.
              </p>
            </div>
          ) : (
            <div className="trip-gallery-grid">
              {photos.map((photo, index) => (
                <figure
                  className="trip-gallery-item"
                  key={`${photo}-${index}`}
                >
                  <img
                    src={photo}
                    alt={`${trip.title} memory ${index + 1}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <figcaption>Memory {index + 1}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        <div className="trip-details-bottom">
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <footer className="dashboard-footer">
        Made for your next adventure · TripVault
      </footer>
    </main>
  );
}

export default TripDetails;
