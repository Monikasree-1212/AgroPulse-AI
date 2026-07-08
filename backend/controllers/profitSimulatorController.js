const Activity = require('../models/Activity')

const simulate = (req, res) => {
  const { commodity, quantity, currentPrice, predictedPrice, storageCost, transportCost, daysToHold } = req.body

  if (!commodity || quantity == null || currentPrice == null || predictedPrice == null || storageCost == null || transportCost == null || daysToHold == null)
    return res.status(400).json({ message: 'All fields are required.' })

  const fields = { quantity, currentPrice, predictedPrice, storageCost, transportCost, daysToHold }
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val !== 'number' || val < 0)
      return res.status(400).json({ message: `Invalid value for ${key}. Must be a non-negative number.` })
  }

  const currentRevenue   = quantity * currentPrice
  const futureRevenue    = quantity * predictedPrice
  const storageExpense   = quantity * storageCost
  const transportExpense = quantity * transportCost
  const netFutureProfit  = futureRevenue - storageExpense - transportExpense
  const profitDifference = netFutureProfit - currentRevenue
  const recommendation   = profitDifference > 0 ? 'HOLD' : 'SELL TODAY'
  const roi              = currentRevenue > 0 ? +((profitDifference / currentRevenue) * 100).toFixed(2) : 0
  const breakEvenPrice   = +((currentRevenue + storageExpense + transportExpense) / quantity).toFixed(2)

  res.json({
    commodity,
    quantity,
    daysToHold,
    currentRevenue,
    futureRevenue,
    storageExpense,
    transportExpense,
    netFutureProfit,
    profitDifference,
    recommendation,
    roi,
    breakEvenPrice,
  })
  // Log activity after response
  Activity.create({
    activityType: 'profit',
    commodity,
    description:  `Profit Simulator: ${recommendation} for ${commodity} - ROI ${roi >= 0 ? '+' : ''}${roi}% over ${daysToHold} days`,
    metadata:     { recommendation, roi, profitDifference, daysToHold },
  }).catch(() => {})
}

module.exports = { simulate }
