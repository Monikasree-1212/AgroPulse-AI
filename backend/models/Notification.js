const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  type:      { type: String, enum: ['price', 'weather', 'mandi', 'government', 'profit'], default: 'price' },
  commodity: { type: String, default: '' },
  priority:  { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  isRead:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Notification', notificationSchema)
