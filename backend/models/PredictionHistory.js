const mongoose = require('mongoose');

const predictionHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  todayPrice: {
    type: Number,
    required: true
  },
  predictedPrice: {
    type: Number,
    required: true
  },
  predictionDate: {
    type: Date,
    default: Date.now
  },
  recommendation: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);
