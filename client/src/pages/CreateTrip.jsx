
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../App.css";

function CreateTrip() {
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    if (selected.length === 0) return;

    const validPhotos = selected.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validPhotos.length !== selected.length) {
      setError("Please select only JPG, PNG, or WebP images.");
      if (validPhotos.length === 0) return;
    } else {
      setError("");
    }

    const newPhotos = validPhotos.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((previous) => [...previous, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos((previous) => {
      URL.revokeObjectURL(previous[index].preview);
      return previous.filter((_, i) => i !== index);
    });

    setCoverIndex((previousCover) => {
      if (index === previousCover) return 0;
      if (index < previousCover) return previousCover - 1;
      return previousCover;
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

      const payload = {
        ...formData,
        rating: formData.rating ? Number(formData.rating) : undefined,
      };

      const response = await api.post("/api/trips", payload);
      const tripId = response.data.trip._id;

      // Upload all photos, placing the selected cover photo first.
      const orderedPhotos = photos.length
        ? [
            photos[coverIndex],
            ...photos.filter((_, index) => index !== coverIndex),
          ]
        : [];

      for (let index = 0; index < orderedPhotos.length; index++) {
        const imageData = new FormData();
        imageData.append("image", orderedPhotos[index].file);

        await api.post(`/api/trips/${tripId}/upload`, imageData);
      }

      navigate("/dashboard", {
        replace: true,
        state: { newTripId: tripId },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to create trip or upload photos. Please try again."
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
            and photos of your adventure here.
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

          <form onSubmit={handleSubmit} className="create-trip-form">
            <div className="form-group">
              <label htmlFor="title">Trip title *</label>
              <input
                id="title"
                name="title"
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
                placeholder="What are you looking forward to?"
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
              <label htmlFor="tripPhotos">Trip photos</label>

              <div className="trip-upload-box">
                <span className="trip-upload-icon">📷</span>
                <p>Select multiple photos for your gallery</p>
                <span className="trip-upload-hint">
                  JPG, PNG or WebP · Select multiple files at once
                </span>
                <input
                  id="tripPhotos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoChange}
                />
              </div>

              {photos.length > 0 && (
                <>
                  <p>{photos.length} photo(s) selected</p>

                  <div className="trip-gallery-grid">
                    {photos.map((photo, index) => (
                      <figure className="trip-gallery-item" key={photo.preview}>
                        <img src={photo.preview} alt={`Selected trip photo ${index + 1}`} />
                        <figcaption>
                          <label>
                            <input
                              type="radio"
                              name="coverSelection"
                              checked={coverIndex === index}
                              onChange={() => setCoverIndex(index)}
                            />
                            {coverIndex === index ? "Cover photo" : "Set as cover"}
                          </label>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => removePhoto(index)}
                          >
                            Remove
                          </button>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </>
              )}
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
                {saving ? "Creating trip and uploading photos..." : "✈ Create Trip"}
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
