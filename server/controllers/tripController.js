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

module.exports = { createTrip };