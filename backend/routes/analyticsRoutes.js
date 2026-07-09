const express = require('express')
const router  = express.Router()
const { getDashboard } = require('../controllers/analyticsController')

router.get('/',          getDashboard)  // GET /api/analytics
router.get('',           getDashboard)
router.get('/dashboard', getDashboard)  // GET /api/analytics/dashboard

module.exports = router
