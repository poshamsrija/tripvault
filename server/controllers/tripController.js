const Trip = require("../models/Trip");

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
    return res.status(500).json({
      message: "Failed to create trip.",
    });
  }
};

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
    return res.status(500).json({
      message: "Failed to fetch trips.",
    });
  }
};
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

    return res.status(200).json({
      trip,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch trip.",
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    // Only the trip owner can update it
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

    // Update only fields provided by the client
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
    return res.status(500).json({
      message: "Failed to update trip.",
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    // Check whether the logged-in user owns this trip
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
    return res.status(500).json({
      message: "Failed to delete trip.",
    });
  }
};

module.exports = { createTrip,getTrips,getTripById,updateTrip,deleteTrip};