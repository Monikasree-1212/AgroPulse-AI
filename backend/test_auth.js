require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteOne({ phone: '1231231234' });
  const user = await User.create({ name: 'Test', phone: '1231231234', password: 'password123' });
  console.log("H1:", user.password);
  
  const foundUser = await User.findOne({ phone: '1231231234' });
  const match = await bcrypt.compare('password123', foundUser.password);
  console.log("M1:", match);
  
  foundUser.lastLogin = new Date();
  await foundUser.save();
  
  const foundUser2 = await User.findOne({ phone: '1231231234' });
  const match2 = await bcrypt.compare('password123', foundUser2.password);
  console.log("M2:", match2);
  console.log("H2:", foundUser2.password);
  
  await mongoose.disconnect();
}
run();
