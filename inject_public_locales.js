const fs = require('fs');
const path = require('path');

const langs = ['en', 'hi', 'ta', 'te', 'kn', 'ml'];
const basePath = 'frontend/public/locales';

langs.forEach(lang => {
  const filePath = path.join(basePath, lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let rawData = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      console.error(`Failed to parse ${filePath}`);
      return;
    }

    // Ensure dashboard object exists
    if (!data.dashboard) {
      data.dashboard = {};
    }

    // Assign predictionTitle
    data.dashboard.predictionTitle = "AI Crop Price Prediction";

    // Assign predictionCard nested object
    data.dashboard.predictionCard = {
      currentPrice: "Current Market Price",
      predictedPrice: "Tomorrow Prediction",
      expectedGain: "Expected Gain",
      trend: "Market Trend",
      confidence: "Confidence Score",
      aiRecommendation: "AI Recommendation",
      increasing: "Increasing",
      decreasing: "Decreasing",
      stable: "Stable",
      dataUnavailable: "Data unavailable",
      fallbackPrediction: "Using fallback prediction",
      recommendationHold: "Hold your stock. Prices are expected to increase tomorrow.",
      recommendationSell: "Sell today. Prices are expected to decrease tomorrow.",
      recommendationStable: "Market is stable. Sell based on your requirement.",
      lastUpdated: "Last Updated",
      justNow: "Just now"
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${filePath}`);
  } else {
    console.warn(`Warning: File not found - ${filePath}`);
  }
});
