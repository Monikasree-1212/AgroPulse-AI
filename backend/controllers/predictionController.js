const axios = require('axios');
const PredictionHistory = require('../models/PredictionHistory');
const Mandi = require('../models/Mandi');

function getCurrentSeason(month) {
  if ([12, 1, 2].includes(month)) return "Winter";
  if ([3, 4, 5].includes(month)) return "Summer";
  if ([6, 7, 8, 9].includes(month)) return "Monsoon";
  return "Post-Monsoon";
}

exports.getPrediction = async (req, res) => {
  try {
    const { crop, state, district } = req.body;
    
    if (!crop || !state || !district) {
      return res.status(400).json({ success: false, message: 'Crop, state, and district are required.' });
    }
    
    // Find today's real price from latest Mandi entry
    let todayPrice = 35.0; // fallback default
    const mandiData = await Mandi.findOne({ state, district, crop }).sort({ lastUpdated: -1 });
    if (mandiData) {
      todayPrice = mandiData.todaysPrice;
    }
    
    // Dynamically generate current macro variables for prediction
    const now = new Date();
    const month = now.getMonth() + 1;
    const season = getCurrentSeason(month);
    
    // Call Python FastAPI ML Service
    const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/api/ml/predict';
    
    const mlPayload = {
      crop,
      state,
      district,
      month,
      season,
      rainfall: Math.random() * 50 + 20,       // Randomized or mocked for this request if live API unavailable
      temperature: Math.random() * 15 + 20,
      humidity: Math.random() * 40 + 40,
      fuelPrice: 95.0 + Math.random() * 10,
      transportCost: Math.random() * 5 + 2,
      arrivalQuantity: Math.random() * 100 + 50,
      supplyIndex: Math.random() * 100 + 80,
      demandIndex: Math.random() * 100 + 100,
      todayPrice
    };
    
    let mlData = null;
    try {
        const mlResponse = await axios.post(mlUrl, mlPayload, { timeout: 3000 });
        mlData = mlResponse.data;
    } catch(e) {
        console.error("Machine Learning Service currently unavailable:", e.message);
        
        // ML unavailable, fallback gently keeping Node running
        return res.status(200).json({
           success: true,
           mode: 'fallback',
           predictedPrice: Number((todayPrice * 1.05).toFixed(2)),
           trend: "Increasing",
           confidence: 75,
           recommendation: "Wait Until Tomorrow"
        });
    }

    const { predictedPrice, confidence, trend } = mlData;
    
    let recommendation = "Sell Today";
    if (predictedPrice > todayPrice) {
      recommendation = "Wait Until Tomorrow";
    }

    // Save to History
    if (req.user) {
        await PredictionHistory.create({
            user: req.user._id,
            crop,
            state,
            district,
            todayPrice,
            predictedPrice,
            recommendation
        });
    }

    return res.status(200).json({
      success: true,
      mode: 'live',
      predictedPrice,
      trend,
      confidence,
      recommendation,
      todayPrice
    });

  } catch (err) {
    console.error("Prediction Controller Error:", err);
    res.status(500).json({ success: false, message: 'Server error retrieving predictions.' });
  }
};

exports.getPredictionForChart = async (req, res) => {
  const commodity = req.params.commodity || 'Onion';
  // simple dummy value for the chart line mirroring old logic
  const dummyPrediction = 45.0 + Math.random() * 5;
  res.json({
    success: true,
    predictedPrice: Number(dummyPrediction.toFixed(2)),
    confidence: 85,
    commodity
  });
};
