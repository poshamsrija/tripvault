
const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  uploadTripPhoto,
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/:id", authMiddleware, getTripById);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);

router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("image"),
  uploadTripPhoto
);

module.exports = router;
