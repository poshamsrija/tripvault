
const Trip = require("../models/Trip");

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    if (!title || !destination) {
      return res.status(400).json({
        message: "Title and destination are required.",
      });
    }

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Trip created successfully.",
      trip,
    });
  } catch (error) {
    console.error("Create trip error:", error.message);

    return res.status(500).json({
      message: "Failed to create trip.",
    });
  }
};

// Get all trips belonging to the logged-in user
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error("Get trips error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch trips.",
    });
  }
};

// Get one trip by ID
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this trip.",
      });
    }

    return res.status(200).json({ trip });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid trip ID.",
      });
    }

    console.error("Get trip by ID error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch trip.",
    });
  }
};

// Update trip details
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this trip.",
      });
    }

    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    if (title !== undefined) trip.title = title;
    if (destination !== undefined) trip.destination = destination;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (description !== undefined) trip.description = description;
    if (rating !== undefined) trip.rating = rating;

    const updatedTrip = await trip.save();

    return res.status(200).json({
      message: "Trip updated successfully.",
      trip: updatedTrip,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid trip ID.",
      });
    }

    console.error("Update trip error:", error.message);

    return res.status(500).json({
      message: "Failed to update trip.",
    });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this trip.",
      });
    }

    await trip.deleteOne();

    return res.status(200).json({
      message: "Trip deleted successfully.",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid trip ID.",
      });
    }

    console.error("Delete trip error:", error.message);

    return res.status(500).json({
      message: "Failed to delete trip.",
    });
  }
};

// Upload a photo or replace the cover photo
const uploadTripPhoto = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to upload photos to this trip.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image.",
      });
    }

    const imageUrl = req.file.path;
    const replaceCover = req.body.replaceCover === "true";

    // Keep the image in the trip gallery
    trip.photos.push(imageUrl);

    // Use it as the cover if no cover exists or replacement was requested
    if (!trip.coverImage || replaceCover) {
      trip.coverImage = imageUrl;
    }

    await trip.save();

    return res.status(200).json({
      message: replaceCover
        ? "Cover photo updated successfully."
        : "Photo uploaded successfully.",
      coverImage: trip.coverImage,
      photos: trip.photos,
    });
  } catch (error) {
    console.error("Photo upload error:", error.message);

    return res.status(500).json({
      message: "Failed to upload photo.",
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  uploadTripPhoto,
};
