const express = require('express')
const router  = express.Router()
const {
  getActivities,
  createActivity,
  deleteActivity,
  clearActivities,
} = require('../controllers/activityController')

router.get('/',        getActivities)
router.post('/',       createActivity)
router.delete('/:id',  deleteActivity)
router.delete('/',     clearActivities)

module.exports = router
