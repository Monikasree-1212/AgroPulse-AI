const User     = require('../models/User')
const Activity = require('../models/Activity')

const SAFE_FIELDS = '-password'

/* ── GET /api/profile ── */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(SAFE_FIELDS).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    /* Stats from Activity collection */
    const activities = await Activity.find().lean()
    const stats = {
      totalPredictions:       activities.filter(a => a.activityType === 'prediction').length,
      totalProfitSimulations: activities.filter(a => a.activityType === 'profit').length,
      totalWeatherChecks:     activities.filter(a => a.activityType === 'weather').length,
      totalMandiSearches:     activities.filter(a => a.activityType === 'mandi').length,
    }

    /* Favourite commodity */
    const freq = {}
    activities.forEach(a => { if (a.commodity) freq[a.commodity] = (freq[a.commodity] ?? 0) + 1 })
    stats.favoriteCommodity = Object.keys(freq).length
      ? Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
      : user.primaryCrop || 'Onion'

    /* Average prediction accuracy */
    const predActs = activities.filter(a => a.activityType === 'prediction' && a.metadata?.confidence != null)
    stats.averagePredictionAccuracy = predActs.length
      ? Math.round(predActs.reduce((s, a) => s + a.metadata.confidence, 0) / predActs.length)
      : 91

    res.json({ ...user, stats })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ── PUT /api/profile ── */
exports.updateProfile = async (req, res) => {
  try {
    const { name, state, district, village, primaryCrop, farmSize, preferredLanguage, profileImage } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name)                    user.name              = name.trim()
    if (state !== undefined)     user.state             = state
    if (district !== undefined)  user.district          = district
    if (village !== undefined)   user.village           = village
    if (primaryCrop)             user.primaryCrop       = primaryCrop
    if (farmSize !== undefined)  user.farmSize          = Number(farmSize) || 0
    if (preferredLanguage)       user.preferredLanguage = preferredLanguage
    if (profileImage !== undefined) user.profileImage   = profileImage

    await user.save()
    const { password: _, ...safe } = user.toObject()
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ── PUT /api/profile/preferences ── */
exports.updatePreferences = async (req, res) => {
  try {
    const { preferredLanguage, primaryCrop, state, district, village, farmSize } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (preferredLanguage)      user.preferredLanguage = preferredLanguage
    if (primaryCrop)            user.primaryCrop       = primaryCrop
    if (state !== undefined)    user.state             = state
    if (district !== undefined) user.district          = district
    if (village !== undefined)  user.village           = village
    if (farmSize !== undefined) user.farmSize          = Number(farmSize) || 0

    await user.save()
    const { password: _, ...safe } = user.toObject()
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
