const axios    = require("axios");
const Activity = require("../models/Activity");

const ML_URL = process.env.ML_URL || "http://localhost:8000";

const getPrediction = async (req, res) => {
  const { commodity, day } = req.params;
  console.log(`[Prediction] Request: commodity=${commodity} day=${day}`);
  try {
    const mlEndpoint = `${ML_URL}/predict/${commodity}/${day}`;
    console.log(`[Prediction] Calling ML server: GET ${mlEndpoint}`);

    const response = await axios.get(mlEndpoint, { timeout: 10000 });
    console.log(`[Prediction] ML response:`, response.data);

    res.json(response.data);

    Activity.create({
      activityType: 'prediction',
      commodity,
      description:  `AI predicted ${commodity} price — ₹${response.data.predictedPrice}/kg (${response.data.confidence}% confidence) for day ${day}`,
      metadata:     { predictedPrice: response.data.predictedPrice, confidence: response.data.confidence, day },
    }).catch(() => {});
  } catch (error) {
    console.error(`[Prediction] Error for ${commodity}/${day}:`, error.message);
    if (error.stack) console.error(error.stack);

    // Forward the real error message so the frontend can display it
    const status  = error.response?.status  || 500;
    const message = error.response?.data?.error
      || error.response?.data?.message
      || (error.code === 'ECONNREFUSED'
          ? `ML server is not running on ${ML_URL}. Start it with: cd ml-model && python app.py`
          : error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED'
          ? 'ML server timed out. Make sure it is running and responsive.'
          : error.message
         );

    res.status(status).json({ message });
  }
};

module.exports = { getPrediction };
