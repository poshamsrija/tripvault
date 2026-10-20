
const User = require("../models/User");
const Trip = require("../models/Trip");

// GET: Public profile by username
const getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    const user = await User.findOne({ username })
      .select("name username bio createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    const trips = await Trip.find({ user: user._id })
      .select(
        "title destination description startDate endDate rating coverImage photos createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ user, trips });
  } catch (error) {
    console.error("Public profile error:", error);

    return res.status(500).json({
      message: "Failed to fetch public profile",
    });
  }
};

// PUT: Update the logged-in user's bio
const updateMyProfile = async (req, res) => {
  try {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body:", req.body);

    const bio =
      typeof req.body?.bio === "string"
        ? req.body.bio.trim()
        : null;

    if (bio === null) {
      return res.status(400).json({
        message: "Bio is missing or must be a string. Send a JSON body.",
      });
    }

    if (bio.length > 300) {
      return res.status(400).json({
        message: "Bio cannot exceed 300 characters",
      });
    }

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { bio } },
      {
        new: true,
        runValidators: true,
      }
    ).select("name username bio createdAt");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  getPublicProfile,
  updateMyProfile,
};
