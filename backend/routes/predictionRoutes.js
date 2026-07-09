const express = require("express");
const router = express.Router();
const { getPredictionOverview, getPrediction, getPredictionHistory } = require("../controllers/predictionController");

router.get("/",                  getPredictionOverview); // GET /api/predict
router.get("",                   getPredictionOverview);
router.get("/history",          getPredictionHistory);  // GET /api/predict/history
router.get("/:commodity/:day",   getPrediction);         // GET /api/predict/:commodity/:day

module.exports = router;
