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

    if (data.dashboard && data.dashboard.predictionCard) {
      data.dashboard.predictionCard.mlPrediction = "ML Prediction";
      data.dashboard.predictionCard.fallbackPrediction = "Fallback Prediction";
      data.dashboard.predictionCard.predictionSource = "Prediction Source";
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Successfully updated ${filePath}`);
    }
  }
});
