const fs = require('fs'); 
const langs = ['en', 'hi']; 
langs.forEach(l => { 
  const p = `frontend/src/locales/${l}.json`; 
  let d = JSON.parse(fs.readFileSync(p, 'utf8')); 
  d.dashboard.predictionCard = { 
    currentPrice: 'Current Market Price', 
    predictedPrice: 'Tomorrow Prediction', 
    expectedGain: 'Expected Gain/Loss', 
    trend: 'Market Trend', 
    confidence: 'Confidence Score', 
    aiRecommendation: 'AI Recommendation', 
    increasing: 'Increasing', 
    decreasing: 'Decreasing', 
    stable: 'Stable', 
    dataUnavailable: 'Data unavailable', 
    fallbackPrediction: 'Using fallback prediction', 
    recommendationHold: 'Hold your stock. Prices are expected to increase tomorrow.', 
    recommendationSell: 'Sell today. Prices are expected to decrease tomorrow.', 
    recommendationStable: 'Market is stable. Sell based on your requirement.', 
    lastUpdated: 'Last Updated', 
    justNow: 'Just now' 
  }; 
  fs.writeFileSync(p, JSON.stringify(d, null, 2)); 
});
