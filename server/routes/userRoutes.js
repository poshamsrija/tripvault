
const express = require("express");
const router = express.Router();

const { getPublicProfile } = require("../controllers/userController");

router.get("/:username/profile", getPublicProfile);

module.exports = router;
