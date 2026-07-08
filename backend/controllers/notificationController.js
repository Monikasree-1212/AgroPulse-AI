const Notification = require('../models/Notification')
const Commodity    = require('../models/Commodity')
const GovernmentScheme = require('../models/GovernmentScheme')
const axios = require('axios')
const { getWeatherByCity } = require('../services/weatherService')

/* -----------------------------------------
   CRUD handlers
----------------------------------------- */
const getNotifications = async (req, res) => {
  try {
    const { type } = req.query
    const filter = type && type !== 'all' ? { type } : {}
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50)
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createNotification = async (req, res) => {
  try {
    const n = await Notification.create(req.body)
    res.status(201).json(n)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const markAsRead = async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    )
    if (!n) return res.status(404).json({ message: 'Not found' })
    res.json(n)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({})
    res.json({ message: 'All cleared' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* -----------------------------------------
   Auto-generate notifications
   - calls DB / services directly (no HTTP self-loop)
----------------------------------------- */
const COMMODITIES = ['Onion', 'Potato', 'Pulses', 'Maize', 'Coconut']
const DEDUP_PRICE_MS   = 30 * 60 * 1000   // 30 min
const DEDUP_WEATHER_MS = 60 * 60 * 1000   // 1 hr
const ML_BASE = 'http://localhost:8000'

const autoGenerateNotifications = async () => {
  /* -- 1. Price alerts (query DB + ML directly) -- */
  for (const commodity of COMMODITIES) {
    try {
      // Check dedup first - skip if recent price alert exists
      const recentPrice = await Notification.findOne({
        commodity,
        type: 'price',
        createdAt: { $gte: new Date(Date.now() - DEDUP_PRICE_MS) },
      })
      if (recentPrice) continue

      // Get latest price from DB
      const doc = await Commodity.findOne({ commodity })
      if (!doc || !doc.prices?.length) continue
      const currentPrice = doc.prices[doc.prices.length - 1].price

      // Get prediction from ML server directly
      const predRes = await axios.get(`${ML_BASE}/predict/${commodity}/8`, { timeout: 5000 })
      const predictedPrice = predRes.data?.predictedPrice
      if (!predictedPrice) continue

      const diff    = +(predictedPrice - currentPrice).toFixed(2)
      const rising  = diff > 0
      const absDiff = Math.abs(diff)

      await Notification.create({
        title:     rising ? `${commodity} Price Rising 📈` : `${commodity} Price Falling Downward`,
        message:   rising
          ? `AI predicts ${commodity} price may increase by Rs.${absDiff}/kg. Consider holding your stock.`
          : `AI predicts ${commodity} price may decrease by Rs.${absDiff}/kg. Consider selling now.`,
        type:      'price',
        commodity,
        priority:  absDiff > 5 ? 'high' : 'medium',
      })
    } catch (_) {
      // ML server offline or commodity missing - skip silently
    }
  }

  /* -- 2. Weather alert (call service directly) -- */
  try {
    const recentWeather = await Notification.findOne({
      type: 'weather',
      createdAt: { $gte: new Date(Date.now() - DEDUP_WEATHER_MS) },
    })
    if (!recentWeather) {
      const weather  = await getWeatherByCity('Delhi')
      const isHeavy  = ['Rain', 'Thunderstorm', 'Drizzle'].includes(weather.condition)
                    || weather.rainfall > 5
                    || weather.humidity > 85
      if (isHeavy) {
        await Notification.create({
          title:    'Heavy Rainfall Alert Rain',
          message:  `Heavy rainfall expected in Delhi (${weather.condition}, Humidity: ${weather.humidity}%). Harvest carefully and protect stored crops.`,
          type:     'weather',
          priority: 'high',
        })
      }
    }
  } catch (_) {}

  /* -- 3. Government scheme alert (query DB directly) -- */
  try {
    const schemes = await GovernmentScheme.find().sort({ createdAt: -1 }).limit(1)
    if (schemes.length > 0) {
      const latest  = schemes[0]
      const existing = await Notification.findOne({
        type:  'government',
        title: { $regex: latest.title.substring(0, 30), $options: 'i' },
      })
      if (!existing) {
        await Notification.create({
          title:    'New Government Scheme Available Government',
          message:  `New scheme: "${latest.title}" is now available for farmers. Check the Government Schemes section for details.`,
          type:     'government',
          priority: 'medium',
        })
      }
    }
  } catch (_) {}
}

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
  autoGenerateNotifications,
}
