
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function CreateTrip() {
  const navigate = useNavigate();

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        rating: formData.rating
          ? Number(formData.rating)
          : undefined,
      };

      const response = await api.post("/api/trips", payload);
      const tripId = response.data.trip._id;

      if (coverPhoto) {
        const imageData = new FormData();
        imageData.append("image", coverPhoto);

        await api.post(`/api/trips/${tripId}/upload`, imageData);
      }

      setSuccess("Trip created successfully!");

      setTimeout(() => {
        navigate("/dashboard", {
          state: { newTripId: tripId },
        });
      }, 900);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to create trip. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="create-trip-page">
      <header className="create-trip-header">
        <Link to="/dashboard" className="dashboard-logo">
          <span className="auth-brand-icon">✈</span>
          TripVault
        </Link>

        <Link to="/dashboard" className="back-dashboard-link">
          ← Dashboard
        </Link>
      </header>

      <div className="create-trip-container">
        <section className="create-trip-intro">
          <p className="dashboard-eyebrow">YOUR NEXT ADVENTURE</p>
          <h1>Create a New Trip</h1>
          <p>
            Every great journey starts with a plan. Save the details
            of your next adventure here.
          </p>
        </section>

        <section className="create-trip-card">
          <div className="create-trip-card-heading">
            <span className="create-trip-icon">🌍</span>
            <div>
              <h2>Trip details</h2>
              <p>Tell us a little about your journey.</p>
            </div>
          </div>

          {error && (
            <div className="trip-alert trip-alert-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="trip-alert trip-alert-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-trip-form">
            <div className="form-group">
              <label htmlFor="title">Trip title *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. My Goa Getaway"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination *</label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Goa, India"
                required
              />
            </div>

            <div className="create-trip-date-grid">
              <div className="form-group">
                <label htmlFor="startDate">Start date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  max={formData.endDate || undefined}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || undefined}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Trip description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What are you looking forward to on this trip?"
                rows={4}
                maxLength={2000}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Your trip rating</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="">Not rated yet</option>
                <option value="1">⭐ 1 — Poor</option>
                <option value="2">⭐⭐ 2 — Fair</option>
                <option value="3">⭐⭐⭐ 3 — Good</option>
                <option value="4">⭐⭐⭐⭐ 4 — Very good</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 — Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coverPhoto">Cover photo</label>
              <div className="trip-upload-box">
                <span className="trip-upload-icon">📷</span>
                <p>
                  {coverPhoto
                    ? coverPhoto.name
                    : "Choose a photo for your trip"}
                </p>
                <span className="trip-upload-hint">
                  JPG, PNG or WebP
                </span>
                <input
                  id="coverPhoto"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) =>
                    setCoverPhoto(event.target.files?.[0] || null)
                  }
                />
              </div>
            </div>

            <div className="create-trip-actions">
              <Link to="/dashboard" className="btn btn-secondary">
                Cancel
              </Link>

              <button
                className="btn btn-primary create-trip-submit"
                type="submit"
                disabled={saving}
              >
                {saving ? "Creating trip..." : "✈ Create Trip"}
              </button>
            </div>
          </form>
        </section>

        <p className="create-trip-note">
          Your journeys are saved to your personal TripVault.
        </p>
      </div>
    </main>
  );
}

export default CreateTrip;
