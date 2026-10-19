
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

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

        // Upload the cover photo if one was selected
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
      }, 700);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || "Failed to create trip."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Create a New Trip</h1>
      <p>Save the details of your next adventure!</p>

      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Trip title *</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="destination">Destination *</label>
          <input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="startDate">Start date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="endDate">End date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="rating">Rating (1–5)</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="">Not rated</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
        <label htmlFor="coverPhoto">Cover Photo</label>
        <input
            id="coverPhoto"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setCoverPhoto(e.target.files[0])}
        />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Creating trip..." : "Create Trip"}
        </button>
      </form>

      <p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </p>
    </div>
  );
}

export default CreateTrip;
