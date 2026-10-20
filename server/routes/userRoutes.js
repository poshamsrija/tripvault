
const express = require("express");
const router = express.Router();

const {
  getPublicProfile,
  updateMyProfile,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/:username/profile", getPublicProfile);
router.put("/me/profile", authMiddleware, updateMyProfile);

module.exports = router;
