const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, predictionController.getPrediction);
router.get('/:commodity/:days', predictionController.getPredictionForChart);

module.exports = router;
