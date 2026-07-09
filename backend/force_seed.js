require('dotenv').config();
const mongoose = require('mongoose');
const sampleData = require('./data/sampleData');
const Mandi = require('./models/Mandi');
const GovernmentScheme = require('./models/GovernmentScheme');

async function reseed() {
  await mongoose.connect(process.env.MONGO_URI, {});
  console.log('Connected to DB');

  await Mandi.deleteMany({});
  console.log('Wiped all Mandis');
  await Mandi.insertMany(sampleData.mandis);
  console.log(`Reseeded with ${sampleData.mandis.length} mandis from sampleData`);

  await GovernmentScheme.deleteMany({});
  console.log('Wiped all Schemes');
  await GovernmentScheme.insertMany(sampleData.governmentSchemes);
  console.log(`Reseeded with ${sampleData.governmentSchemes.length} schemes from sampleData`);

  process.exit(0);
}

reseed().catch(console.error);
