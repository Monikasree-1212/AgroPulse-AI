const Commodity = require('../models/Commodity')
const Mandi = require('../models/Mandi')
const GovernmentScheme = require('../models/GovernmentScheme')
const User = require('../models/User')
const Activity = require('../models/Activity')
const Notification = require('../models/Notification')
const Analytics = require('../models/Analytics')
const Report = require('../models/Report')
const sampleData = require('../data/sampleData')

const seedIfEmpty = async (Model, records, label) => {
  const count = await Model.countDocuments()
  if (count > 0) return false
  await Model.insertMany(records)
  console.log(`[Seed] ${label} collection was empty. Inserted ${records.length} records.`)
  return true
}

const ensureSeedData = async () => {
  await seedIfEmpty(Commodity, sampleData.commodities, 'Commodities')
  await seedIfEmpty(Mandi, sampleData.mandis, 'Mandis')
  await seedIfEmpty(GovernmentScheme, sampleData.governmentSchemes, 'GovernmentSchemes')
  await seedIfEmpty(User, sampleData.users, 'Users')
  await seedIfEmpty(Activity, sampleData.activities, 'Activities')
  await seedIfEmpty(Notification, sampleData.notifications, 'Notifications')
  await seedIfEmpty(Analytics, sampleData.analytics, 'Analytics')
  await seedIfEmpty(Report, sampleData.reports, 'Reports')
}

module.exports = ensureSeedData
