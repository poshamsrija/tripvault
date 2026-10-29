
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef([]);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [currentCover, setCurrentCover] = useState("");
  const [photos, setPhotos] = useState([]);
  const [coverIndex, setCoverIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
          rating: trip.rating != null ? String(trip.rating) : "",
        });

        setCurrentCover(trip.coverImage || "");
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

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError("Please select image files only.");
      event.target.value = "";
      return;
    }

    const newPhotos = files.map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrlsRef.current.push(preview);
      return { file, preview };
    });

    setPhotos((previous) => [...previous, ...newPhotos]);

    // If no new cover is selected yet, use the first newly added photo.
    setCoverIndex((previous) =>
      previous === -1 ? 0 : previous
    );

    setError("");
    event.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos((previous) => {
      const removed = previous[index];

      if (removed) {
        URL.revokeObjectURL(removed.preview);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (url) => url !== removed.preview
        );
      }

      return previous.filter((_, photoIndex) => photoIndex !== index);
    });

    setCoverIndex((previous) => {
      if (previous === index) return -1;
      if (previous > index) return previous - 1;
      return previous;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

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

      // Upload each selected photo.
      for (let index = 0; index < photos.length; index++) {
        const photoData = new FormData();

        // Send the flag before the file field.
        if (index === coverIndex) {
          photoData.append("replaceCover", "true");
        }

        photoData.append("image", photos[index].file);

        await api.post(`/api/trips/${id}/upload`, photoData);
      }

      navigate(`/trips/${id}`, {
        replace: true,
        state: { message: "Trip updated successfully!" },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Update failed. Please try again."
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

        <Link to={`/trips/${id}`} className="back-dashboard-link">
          ← Back to trip
        </Link>
      </header>

      <div className="create-trip-container">
        <section className="create-trip-intro">
          <p className="dashboard-eyebrow">YOUR JOURNEY</p>
          <h1>Edit Trip</h1>
          <p>Update your travel details and add new memories.</p>
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

            <div className="form-group">
              <label>Current cover photo</label>

              {currentCover ? (
                <img
                  src={currentCover}
                  alt="Current trip cover"
                  style={{
                    display: "block",
                    width: "100%",
                    maxHeight: "260px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                />
              ) : (
                <p>No cover photo uploaded yet.</p>
              )}

              <label htmlFor="edit-photos">Add photos</label>
              <input
                ref={fileInputRef}
                id="edit-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
              />

              <small>
                Select multiple images. Choose one below if you want
                to replace the current cover photo.
              </small>
            </div>

            {photos.length > 0 && (
              <div className="form-group">
                <label>New photos — choose the cover</label>

                <div className="trip-gallery-grid">
                  {photos.map((photo, index) => (
                    <figure
                      className="trip-gallery-item"
                      key={photo.preview}
                    >
                      <img
                        src={photo.preview}
                        alt={`New trip photo ${index + 1}`}
                      />

                      <figcaption>
                        <label>
                          <input
                            type="radio"
                            name="newCover"
                            checked={coverIndex === index}
                            onChange={() => setCoverIndex(index)}
                          />
                          {coverIndex === index
                            ? "New cover photo"
                            : "Set as cover"}
                        </label>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => removePhoto(index)}
                          disabled={saving}
                        >
                          Remove
                        </button>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {coverIndex === -1 && (
                  <small>
                    No new cover selected. Your current cover will stay.
                  </small>
                )}
              </div>
            )}

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
                {saving ? "Saving photos..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditTrip;
