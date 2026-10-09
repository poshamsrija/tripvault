const express = require("express");
const router = express.Router();

const { createTrip } = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTrip);

module.exports = router;