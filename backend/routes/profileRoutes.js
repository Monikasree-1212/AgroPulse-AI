const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/authMiddleware')
const { getProfile, updateProfile, updatePreferences } = require('../controllers/profileController')

const optionalAuth = (req, res, next) => {
  if (!req.headers.authorization) return next()
  return auth(req, res, next)
}

router.get('/',            optionalAuth, getProfile)
router.put('/',            auth, updateProfile)
router.put('/preferences', auth, updatePreferences)

module.exports = router
