
const User = require("../models/User");
const Trip = require("../models/Trip");

const getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();

    const user = await User.findOne({ username })
      .select("name username bio createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    const trips = await Trip.find({ user: user._id })
      .select("title destination description startDate endDate rating coverImage photos createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      user,
      trips,
    });
  } catch (error) {
    console.error("Public profile error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch public profile",
    });
  }
};

module.exports = { getPublicProfile };
