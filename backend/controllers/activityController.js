const Activity = require('../models/Activity')

const getActivities = async (req, res) => {
  try {
    const { type } = req.query
    const filter = type && type !== 'all' ? { activityType: type } : {}
    const activities = await Activity.find(filter).sort({ createdAt: -1 }).limit(100)
    res.json(activities)
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}

const createActivity = async (req, res) => {
  try {
    const a = await Activity.create(req.body)
    res.status(201).json(a)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}

const clearActivities = async (req, res) => {
  try {
    await Activity.deleteMany({})
    res.json({ message: 'All cleared' })
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}

module.exports = { getActivities, createActivity, deleteActivity, clearActivities }
