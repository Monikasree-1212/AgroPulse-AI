const mongoose = require('mongoose')

const analyticsSchema = new mongoose.Schema({
  key:       { type: String, required: true, unique: true },
  value:     { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Analytics', analyticsSchema)
