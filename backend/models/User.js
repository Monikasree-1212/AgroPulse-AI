const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  phone:             { type: String, required: true, unique: true, match: /^\d{10}$/ },
  password:          { type: String, required: true, minlength: 6 },
  state:             { type: String, default: '' },
  district:          { type: String, default: '' },
  village:           { type: String, default: '' },
  primaryCrop:       { type: String, default: 'Onion' },
  farmSize:          { type: Number, default: 0 },
  preferredLanguage: { type: String, default: 'English' },
  profileImage:      { type: String, default: '' },
  role:              { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  lastLogin:         { type: Date, default: null },
  createdAt:         { type: Date, default: Date.now },
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('User', userSchema)
