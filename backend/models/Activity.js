const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  activityType: {
    type: String,
    enum: ['price', 'prediction', 'weather', 'profit', 'mandi', 'voice', 'government'],
    required: true,
  },
  commodity:   { type: String, default: '' },
  description: { type: String, required: true },
  metadata:    { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt:   { type: Date, default: Date.now },
})

module.exports = mongoose.model('Activity', activitySchema)
