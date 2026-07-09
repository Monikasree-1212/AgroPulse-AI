require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const bcrypt = require('bcryptjs');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Create a user
  await User.deleteOne({ phone: '1231231234' });
  const user = await User.create({
    name: 'Test',
    phone: '1231231234',
    password: 'password123'
  });
  
  console.log("Password hash in DB:", user.password);
  
  // Try to login
  const foundUser = await User.findOne({ phone: '1231231234' });
  const match = await bcrypt.compare('password123', foundUser.password);
  console.log("Match direct from DB?", match);
  
  // What if we save it again?
  foundUser.lastLogin = new Date();
  await foundUser.save();
  
  const foundUser2 = await User.findOne({ phone: '1231231234' });
  const match2 = await bcrypt.compare('password123', foundUser2.password);
  console.log("Match after save()?", match2);
  console.log("Password hash after save:", foundUser2.password);
  
  await mongoose.disconnect();
}
run();
