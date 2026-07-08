const express = require('express')
const router  = express.Router()
const ctrl    = require('../controllers/reportController')

router.get('/predictions/pdf',   ctrl.predictionsPDF)
router.get('/predictions/excel', ctrl.predictionsExcel)
router.get('/predictions/csv',   ctrl.predictionsCSV)
router.get('/weather/pdf',       ctrl.weatherPDF)
router.get('/profit/pdf',        ctrl.profitPDF)
router.get('/analytics/pdf',     ctrl.analyticsPDF)
router.get('/activity/pdf',      ctrl.activityPDF)
router.get('/notifications/pdf', ctrl.notificationsPDF)

module.exports = router
