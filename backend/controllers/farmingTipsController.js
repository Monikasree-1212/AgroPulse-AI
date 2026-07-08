const FarmingTip = require('../models/FarmingTip')
const Commodity  = require('../models/Commodity')
const { getWeatherByCity } = require('../services/weatherService')

/* ─── Determine current Indian agricultural season ─── */
function getCurrentSeason() {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 6 && month <= 9)  return 'Kharif'
  if (month >= 10 || month <= 2) return 'Rabi'
  return 'Zaid'
}

/* ─── Build dynamic tips from live context ─── */
async function buildContextualTips(commodity, weather, predictedPrice, currentPrice) {
  const tips = []
  const season = getCurrentSeason()
  const now    = new Date()

  // Weather-based tips
  if (weather) {
    const { condition, humidity, temperature, rainfall, windSpeed } = weather

    if (['Rain', 'Thunderstorm', 'Drizzle'].includes(condition) || rainfall > 3) {
      tips.push({
        title:       'Delay Irrigation — Rainfall Expected',
        commodity,
        season,
        category:    'Irrigation',
        description: `Heavy rainfall detected (${condition}, ${rainfall}mm). Skip irrigation for the next 2–3 days to avoid waterlogging and root damage.`,
        priority:    'high',
      })
      tips.push({
        title:       'Apply Fertilizer After Rain',
        commodity,
        season,
        category:    'Fertilizer',
        description: `Post-rainfall is the ideal time to apply fertilizer for ${commodity}. Soil moisture improves nutrient absorption by up to 30%.`,
        priority:    'medium',
      })
    }

    if (temperature > 35) {
      tips.push({
        title:       'Increase Irrigation Frequency',
        commodity,
        season,
        category:    'Irrigation',
        description: `High temperature (${temperature}°C) detected. Increase irrigation to twice daily during early morning and evening to prevent heat stress in ${commodity} crops.`,
        priority:    'high',
      })
    }

    if (humidity > 80) {
      tips.push({
        title:       'Fungal Disease Risk — Inspect Crops',
        commodity,
        season,
        category:    'Pest Control',
        description: `High humidity (${humidity}%) increases fungal disease risk for ${commodity}. Inspect crops for early blight, downy mildew, and apply preventive fungicide if needed.`,
        priority:    'high',
      })
    }

    if (windSpeed > 30) {
      tips.push({
        title:       'Protect Crops from Strong Winds',
        commodity,
        season,
        category:    'Weather',
        description: `Wind speed is ${windSpeed} km/h. Stake tall ${commodity} plants and avoid spraying pesticides or fertilizers today to prevent drift losses.`,
        priority:    'medium',
      })
    }

    if (temperature < 10) {
      tips.push({
        title:       'Cold Wave Protection Required',
        commodity,
        season,
        category:    'Weather',
        description: `Temperature has dropped to ${temperature}°C. Cover ${commodity} seedlings with mulch or agro-nets to protect from frost damage overnight.`,
        priority:    'high',
      })
    }
  }

  // Price-based market tips
  if (predictedPrice && currentPrice) {
    const diff    = predictedPrice - currentPrice
    const pctDiff = ((diff / currentPrice) * 100).toFixed(1)

    if (diff > 0) {
      tips.push({
        title:       `${commodity} Prices Rising — Hold Stock`,
        commodity,
        season,
        category:    'Market',
        description: `AI predicts ${commodity} price will rise by ₹${Math.abs(diff).toFixed(2)}/kg (+${pctDiff}%). Store your harvest for 5–7 days to maximise profit.`,
        priority:    Math.abs(diff) > 5 ? 'high' : 'medium',
      })
    } else {
      tips.push({
        title:       `${commodity} Prices Falling — Sell Now`,
        commodity,
        season,
        category:    'Market',
        description: `AI predicts ${commodity} price will fall by ₹${Math.abs(diff).toFixed(2)}/kg (${pctDiff}%). Consider selling your stock today to avoid losses.`,
        priority:    Math.abs(diff) > 5 ? 'high' : 'medium',
      })
    }
  }

  // Season-specific tips
  const seasonTips = {
    Kharif: [
      {
        title:       'Kharif Sowing Window Open',
        commodity,
        season:      'Kharif',
        category:    'Harvest',
        description: `June–July is the optimal sowing period for Kharif ${commodity}. Ensure soil is well-prepared with adequate organic matter before sowing.`,
        priority:    'medium',
      },
      {
        title:       'Monitor Monsoon Pest Activity',
        commodity,
        season:      'Kharif',
        category:    'Pest Control',
        description: `Kharif season brings increased pest pressure for ${commodity}. Regularly scout for aphids, thrips, and stem borers. Use integrated pest management (IPM) practices.`,
        priority:    'medium',
      },
    ],
    Rabi: [
      {
        title:       'Rabi Crop Preparation',
        commodity,
        season:      'Rabi',
        category:    'Fertilizer',
        description: `October–November is ideal for Rabi ${commodity} preparation. Apply basal dose of NPK fertilizer and ensure proper field levelling for uniform irrigation.`,
        priority:    'medium',
      },
      {
        title:       'Winter Storage Precautions',
        commodity,
        season:      'Rabi',
        category:    'Storage',
        description: `Store ${commodity} in well-ventilated, cool, and dry conditions during Rabi season. Maintain temperature between 2–5°C to extend shelf life by 3–4 weeks.`,
        priority:    'low',
      },
    ],
    Zaid: [
      {
        title:       'Zaid Season Water Management',
        commodity,
        season:      'Zaid',
        category:    'Irrigation',
        description: `Zaid (summer) season requires frequent irrigation for ${commodity}. Use drip irrigation to conserve water and maintain soil moisture during peak heat.`,
        priority:    'high',
      },
    ],
  }

  const currentSeasonTips = seasonTips[season] ?? []
  tips.push(...currentSeasonTips)

  // Commodity-specific storage tips
  const storageTips = {
    Onion: {
      title:       'Onion Storage Best Practices',
      commodity:   'Onion',
      season,
      category:    'Storage',
      description: 'Store onions in well-ventilated, dry, and dark conditions at 25–30°C. Avoid stacking more than 3 layers. Check weekly for rotting bulbs and remove immediately.',
      priority:    'medium',
    },
    Potato: {
      title:       'Potato Cold Storage Advisory',
      commodity:   'Potato',
      season,
      category:    'Storage',
      description: 'Store potatoes at 4–10°C in dark conditions to prevent greening. Maintain 90–95% relative humidity. Avoid storing near onions as ethylene gas accelerates sprouting.',
      priority:    'medium',
    },
    Pulses: {
      title:       'Pulses Moisture Control',
      commodity:   'Pulses',
      season,
      category:    'Storage',
      description: 'Dry pulses to below 12% moisture before storage. Use hermetic bags or metal bins to prevent weevil infestation. Add neem leaves as a natural pest repellent.',
      priority:    'low',
    },
    Maize: {
      title:       'Maize Drying Before Storage',
      commodity:   'Maize',
      season,
      category:    'Storage',
      description: 'Dry maize to 13–14% moisture content before storage to prevent aflatoxin contamination. Use solar dryers or spread on clean surfaces for 3–5 days.',
      priority:    'medium',
    },
    Coconut: {
      title:       'Coconut Post-Harvest Handling',
      commodity:   'Coconut',
      season,
      category:    'Storage',
      description: 'Store harvested coconuts in a cool, dry, well-ventilated area. Dehusked coconuts should be sold within 2–3 weeks. Avoid direct sunlight to prevent oil rancidity and weight loss.',
      priority:    'medium',
    },
  }

  if (storageTips[commodity]) tips.push(storageTips[commodity])

  // Harvest timing tip
  tips.push({
    title:       `Best Harvest Window for ${commodity}`,
    commodity,
    season,
    category:    'Harvest',
    description: `Monitor ${commodity} maturity indicators closely. Harvest during early morning hours (6–9 AM) to reduce field heat and improve post-harvest quality and shelf life.`,
    priority:    'low',
  })

  return tips
}

/* ─── Controllers ─── */
const getAllTips = async (req, res) => {
  try {
    const { commodity, season, category, priority } = req.query
    const filter = {}
    if (commodity && commodity !== 'All') filter.commodity = { $regex: new RegExp(`^${commodity}$`, 'i') }
    if (season    && season    !== 'All') filter.season    = season
    if (category  && category  !== 'All') filter.category  = category
    if (priority  && priority  !== 'All') filter.priority  = priority

    const stored = await FarmingTip.find(filter).sort({ priority: 1, createdAt: -1 })

    // Always augment with live contextual tips for the requested commodity
    const targetCommodity = commodity && commodity !== 'All' ? commodity : 'Onion'
    let contextual = []
    try {
      const [weather, commodityDoc] = await Promise.all([
        getWeatherByCity('Delhi').catch(() => null),
        Commodity.findOne({ commodity: { $regex: new RegExp(`^${targetCommodity}$`, 'i') } }).catch(() => null),
      ])
      const prices       = commodityDoc?.prices ?? []
      const currentPrice = prices.length ? prices[prices.length - 1].price : null
      contextual = await buildContextualTips(targetCommodity, weather, null, currentPrice)
    } catch (_) {}

    // Merge: stored DB tips first, then contextual (deduplicated by title)
    const storedTitles = new Set(stored.map(t => t.title))
    const merged = [
      ...stored,
      ...contextual.filter(t => !storedTitles.has(t.title)),
    ]

    res.json(merged)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getTipsByCommodity = async (req, res) => {
  try {
    const { commodity } = req.params
    const stored = await FarmingTip.find({
      commodity: { $regex: new RegExp(`^${commodity}$`, 'i') },
    }).sort({ priority: 1, createdAt: -1 })

    let contextual = []
    try {
      const [weather, commodityDoc] = await Promise.all([
        getWeatherByCity('Delhi').catch(() => null),
        Commodity.findOne({ commodity: { $regex: new RegExp(`^${commodity}$`, 'i') } }).catch(() => null),
      ])
      const prices       = commodityDoc?.prices ?? []
      const currentPrice = prices.length ? prices[prices.length - 1].price : null
      contextual = await buildContextualTips(commodity, weather, null, currentPrice)
    } catch (_) {}

    const storedTitles = new Set(stored.map(t => t.title))
    res.json([...stored, ...contextual.filter(t => !storedTitles.has(t.title))])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getTipsBySeason = async (req, res) => {
  try {
    const { season } = req.params
    const tips = await FarmingTip.find({
      $or: [
        { season: { $regex: new RegExp(`^${season}$`, 'i') } },
        { season: 'All' },
      ],
    }).sort({ priority: 1, createdAt: -1 })
    res.json(tips)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllTips, getTipsByCommodity, getTipsBySeason }
