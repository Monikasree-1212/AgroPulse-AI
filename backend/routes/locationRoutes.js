const express = require("express");
const router  = express.Router();
const { getNearbyMandis } = require("../controllers/locationController");

router.post("/nearby", getNearbyMandis);

module.exports = router;
