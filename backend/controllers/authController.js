const jwt    = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User   = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

/* -- Register -- */
exports.register = async (req, res) => {
  try {
    const { name, phone, password, state, district, primaryCrop, preferredLanguage } = req.body

    if (!name?.trim())               return res.status(400).json({ message: 'Name is required' })
    if (!/^\d{10}$/.test(phone))     return res.status(400).json({ message: 'Phone must be exactly 10 digits' })
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const exists = await User.findOne({ phone })
    if (exists) return res.status(409).json({ message: 'Phone number already registered' })

    const user = await User.create({ name, phone, password, state, district, primaryCrop, preferredLanguage })

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user:  { _id: user._id, name: user.name, phone: user.phone, state: user.state, district: user.district, village: user.village || '', primaryCrop: user.primaryCrop, farmSize: user.farmSize || 0, preferredLanguage: user.preferredLanguage, profileImage: user.profileImage || '', role: user.role, lastLogin: user.lastLogin, createdAt: user.createdAt },
    })
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}

/* -- Login -- */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body

    console.log('Received phone', phone)
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits' })
    if (!password)               return res.status(400).json({ success: false, message: 'Password is required' })

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid phone number or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid phone number or password' })
    }

    user.lastLogin = new Date()
    await user.save()

    const token = signToken(user._id)
    
    res.json({
      success: true,
      token: token,
      user:  { _id: user._id, name: user.name, phone: user.phone, state: user.state, district: user.district, village: user.village, primaryCrop: user.primaryCrop, farmSize: user.farmSize, preferredLanguage: user.preferredLanguage, profileImage: user.profileImage, role: user.role, lastLogin: user.lastLogin, createdAt: user.createdAt },
    })
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}

/* -- Get Profile -- */
exports.getProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}

/* -- Update Profile -- */
exports.updateProfile = async (req, res) => {
  try {
    const { name, state, district, village, primaryCrop, farmSize, preferredLanguage, profileImage } = req.body
    const user = await User.findById(req.user._id)

    if (name)                    user.name              = name.trim()
    if (state !== undefined)     user.state             = state
    if (district !== undefined)  user.district          = district
    if (village !== undefined)   user.village           = village
    if (primaryCrop)             user.primaryCrop       = primaryCrop
    if (farmSize !== undefined)  user.farmSize          = farmSize
    if (preferredLanguage)       user.preferredLanguage = preferredLanguage
    if (profileImage !== undefined) user.profileImage   = profileImage

    await user.save()
    const { password: _, ...safe } = user.toObject()
    res.json(safe)
  } catch (err) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] })
  }
}
