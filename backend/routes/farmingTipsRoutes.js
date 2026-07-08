const express = require('express')
const router  = express.Router()
const {
  getAllTips,
  getTipsByCommodity,
  getTipsBySeason,
} = require('../controllers/farmingTipsController')

router.get('/',                        getAllTips)
router.get('/commodity/:commodity',    getTipsByCommodity)
router.get('/season/:season',          getTipsBySeason)

module.exports = router
