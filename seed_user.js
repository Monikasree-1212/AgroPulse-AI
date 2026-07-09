require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const users = await User.find();
    console.log('Users in DB:');
    users.forEach(u => console.log(Math.random(), u.phone, u.password));

    // Seed test user
    const exist = await User.findOne({ phone: '9876543210' });
    if (!exist) {
      console.log('Seeding test user 9876543210...');
      // Just check what bcrypt does here. If we hash explicitly and rely on User.create
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        phone: '9876543210',
        password: hashedPassword 
      });
      console.log('Seeded.');
    } else {
      console.log('Test user exists. Pwd hash:', exist.password);
      // Wait, is it double hashed? Let's test bcrypt compare on 'password123'
      const match = await bcrypt.compare('password123', exist.password);
      console.log('Does password123 match?', match);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
