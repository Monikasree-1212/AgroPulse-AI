const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/authMiddleware')
const { getProfile, updateProfile, updatePreferences } = require('../controllers/profileController')

router.get('/',            auth, getProfile)
router.put('/',            auth, updateProfile)
router.put('/preferences', auth, updatePreferences)

module.exports = router
