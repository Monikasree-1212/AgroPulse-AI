const mongoose = require('mongoose')

const farmingTipSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  commodity:   { type: String, required: true },
  season:      { type: String, enum: ['Kharif', 'Rabi', 'Zaid', 'All'], required: true },
  category:    { type: String, enum: ['Weather', 'Harvest', 'Storage', 'Market', 'Fertilizer', 'Irrigation', 'Pest Control'], required: true },
  description: { type: String, required: true },
  priority:    { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  createdAt:   { type: Date, default: Date.now },
})

module.exports = mongoose.model('FarmingTip', farmingTipSchema)
