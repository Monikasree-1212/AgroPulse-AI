require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agropulse')
  .then(async () => {
    const exist = await User.findOne({ phone: '9876543210' });
    console.log('User found:', exist.phone);
    console.log('Password hash:', exist.password);
    const match = await bcrypt.compare('password123', exist.password);
    console.log('Bcrypt compare result:', match);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
