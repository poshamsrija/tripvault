const express = require("express");
const router = express.Router();

const { createTrip,getTrips,getTripById,updateTrip,deleteTrip} = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware,getTrips);
router.get("/:id",authMiddleware,getTripById);
router.put("/:id",authMiddleware,updateTrip);
router.delete("/:id",authMiddleware,deleteTrip);
module.exports = router;