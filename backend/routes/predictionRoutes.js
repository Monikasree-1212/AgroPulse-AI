const express = require("express");
const router = express.Router();
const { getPrediction } = require("../controllers/predictionController");

router.get("/:commodity/:day", getPrediction);

module.exports = router;
