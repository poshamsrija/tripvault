
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

function PublicProfile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");
        setIsOwner(false);

        // Fetch the public profile and trips.
        const response = await api.get(
          `/api/users/${encodeURIComponent(username)}/profile`
        );

        if (cancelled) return;

        const user = response.data.user;

        setProfile(user);
        setTrips(response.data.trips || []);
        setBio(user.bio || "");

        // Check ownership using the current login token.
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const meResponse = await api.get("/api/auth/me");

            if (cancelled) return;

            const me = meResponse.data.user || meResponse.data;

            const ownsProfile =
              Boolean(me.username) &&
              me.username.toLowerCase() ===
                user.username.toLowerCase();

            setIsOwner(ownsProfile);
          } catch {
            if (!cancelled) {
              setIsOwner(false);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const handleBioUpdate = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put("/api/users/me/profile", {
        bio,
      });

      const updatedBio = response.data.user.bio || "";

      setProfile((previous) => ({
        ...previous,
        bio: updatedBio,
      }));

      setBio(updatedBio);
      setMessage("Bio updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update bio."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error && !profile) {
    return <p role="alert">{error}</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <main>
      <h1>{profile.name}'s Travel Profile</h1>

      <p>@{profile.username}</p>

      {/* Public information remains visible after logout. */}
      <p>{profile.bio || "No bio added yet."}</p>

      {/* Only the profile owner can see the editing form. */}
      {isOwner && (
        <section>
          <h2>Edit Bio</h2>

          <form onSubmit={handleBioUpdate}>
            <label htmlFor="bio">
              About me (maximum 300 characters)
            </label>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              maxLength={300}
              rows={4}
              placeholder="Tell everyone about yourself..."
            />

            <p>{bio.length}/300 characters</p>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Bio"}
            </button>
          </form>

          {message && <p role="status">{message}</p>}
          {error && <p role="alert">{error}</p>}
        </section>
      )}

      <h2>Trips ({trips.length})</h2>

      {trips.length === 0 ? (
        <p>No trips shared yet.</p>
      ) : (
        <div>
          {trips.map((trip) => (
            <article key={trip._id}>
              {trip.coverImage && (
                <img
                  src={trip.coverImage}
                  alt={`${trip.title} cover`}
                  width="300"
                  style={{
                    maxWidth: "100%",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
              )}

              <h3>{trip.title}</h3>
              <p>{trip.destination}</p>

              {trip.description && (
                <p>{trip.description}</p>
              )}
            </article>
          ))}
        </div>
      )}

      <p>
        <Link to="/dashboard">Dashboard</Link>
        {" | "}
        <Link to="/login">Login to TripVault</Link>
      </p>
    </main>
  );
}

export default PublicProfile;
