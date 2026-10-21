
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

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

        // Fetch the selected trip from the backend.
        const response = await api.get(`/api/trips/${id}`);

        if (!cancelled) {
          const data = response.data.trip || response.data;
          setTrip(data);
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
    return <main><p>Loading trip details...</p></main>;
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  if (!trip) {
    return (
      <main>
        <p>Trip not found.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  // Include the cover image and all uploaded photos.
  const photos = [
    ...(trip.coverImage ? [trip.coverImage] : []),
    ...(trip.photos || []),
  ].filter((url, index, all) => all.indexOf(url) === index);

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Link to="/dashboard">← Back to Dashboard</Link>

      <h1>{trip.title}</h1>
      <h3>📍 {trip.destination}</h3>

      {trip.startDate && (
        <p>
          Start date: {new Date(trip.startDate).toLocaleDateString()}
        </p>
      )}

      {trip.endDate && (
        <p>
          End date: {new Date(trip.endDate).toLocaleDateString()}
        </p>
      )}

      {trip.description && <p>{trip.description}</p>}

      {trip.rating != null && <p>Rating: {trip.rating}/5</p>}

      <h2>Trip Photo Gallery ({photos.length})</h2>

      {photos.length === 0 ? (
        <p>No photos uploaded for this trip yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {photos.map((photo, index) => (
            <img
              key={`${photo}-${index}`}
              src={photo}
              alt={`${trip.title} photo ${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default TripDetails;
