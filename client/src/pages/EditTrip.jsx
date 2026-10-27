
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/api/trips/${id}`);
        const trip = response.data.trip;

        const formatDate = (date) =>
          date ? new Date(date).toISOString().split("T")[0] : "";

        setFormData({
          title: trip.title || "",
          destination: trip.destination || "",
          startDate: formatDate(trip.startDate),
          endDate: formatDate(trip.endDate),
          description: trip.description || "",
          rating: trip.rating ? String(trip.rating) : "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load trip details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

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

      await api.put(`/api/trips/${id}`, {
        ...formData,
        rating: formData.rating
          ? Number(formData.rating)
          : undefined,
      });

      setSuccess("Trip updated successfully!");

      setTimeout(() => {
        navigate(`/trips/${id}`, { replace: true });
      }, 800);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to update trip. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="create-trip-page">
        <p className="page-container">Loading trip details...</p>
      </main>
    );
  }

  if (error && !formData.title) {
    return (
      <main className="create-trip-page">
        <div className="create-trip-container">
          <div className="trip-alert trip-alert-error" role="alert">
            {error}
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="create-trip-page">
      <header className="create-trip-header">
        <Link to="/dashboard" className="dashboard-logo">
          <span className="auth-brand-icon">✈</span>
          TripVault
        </Link>

        <Link
          to={`/trips/${id}`}
          className="back-dashboard-link"
        >
          ← Back to trip
        </Link>
      </header>

      <div className="create-trip-container">
        <section className="create-trip-intro">
          <p className="dashboard-eyebrow">YOUR JOURNEY</p>
          <h1>Edit Trip</h1>
          <p>Update the details of your travel memory.</p>
        </section>

        <section className="create-trip-card">
          <div className="create-trip-card-heading">
            <span className="create-trip-icon">🌍</span>
            <div>
              <h2>Trip details</h2>
              <p>Make changes to your journey below.</p>
            </div>
          </div>

          {error && (
            <div className="trip-alert trip-alert-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div
              className="trip-alert trip-alert-success"
              role="status"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-trip-form">
            <div className="form-group">
              <label htmlFor="edit-title">Trip title *</label>
              <input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-destination">Destination *</label>
              <input
                id="edit-destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-trip-date-grid">
              <div className="form-group">
                <label htmlFor="edit-startDate">Start date</label>
                <input
                  id="edit-startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  max={formData.endDate || undefined}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-endDate">End date</label>
                <input
                  id="edit-endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || undefined}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-rating">Trip rating</label>
              <select
                id="edit-rating"
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

            <div className="create-trip-actions">
              <Link
                to={`/trips/${id}`}
                className="btn btn-secondary"
              >
                Cancel
              </Link>

              <button
                className="btn btn-primary create-trip-submit"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditTrip;
