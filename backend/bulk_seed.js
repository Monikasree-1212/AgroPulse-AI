require('dotenv').config();
const mongoose = require('mongoose');

// Generate the 240 Mandis
const rootMandis = [
  { name: 'Koyambedu Market', district: 'Chennai', state: 'Tamil Nadu', distance: 120, transportCost: 3, latitude: 13.0694, longitude: 80.2131 },
  { name: 'Oddanchatram Market', district: 'Dindigul', state: 'Tamil Nadu', distance: 150, transportCost: 4, latitude: 10.4851, longitude: 77.7291 },
  { name: 'Mettupalayam Market', district: 'Coimbatore', state: 'Tamil Nadu', distance: 180, transportCost: 5, latitude: 11.2995, longitude: 76.9362 },
  { name: 'Dindigul Market', district: 'Dindigul', state: 'Tamil Nadu', distance: 140, transportCost: 4, latitude: 10.3673, longitude: 77.9803 },
  { name: 'Coimbatore Market', district: 'Coimbatore', state: 'Tamil Nadu', distance: 100, transportCost: 3, latitude: 11.0168, longitude: 76.9558 },
  { name: 'Madurai Market', district: 'Madurai', state: 'Tamil Nadu', distance: 110, transportCost: 3, latitude: 9.9252, longitude: 78.1198 },
  { name: 'Trichy Market', district: 'Tiruchirappalli', state: 'Tamil Nadu', distance: 130, transportCost: 4, latitude: 10.7905, longitude: 78.7047 },
  { name: 'Salem Market', district: 'Salem', state: 'Tamil Nadu', distance: 160, transportCost: 4, latitude: 11.6643, longitude: 78.1460 },
  { name: 'Erode Market', district: 'Erode', state: 'Tamil Nadu', distance: 190, transportCost: 5, latitude: 11.3410, longitude: 77.7172 },
  { name: 'Hubli Market', district: 'Dharwad', state: 'Karnataka', distance: 210, transportCost: 5, latitude: 15.3647, longitude: 75.1240 },
  { name: 'Mysuru Market', district: 'Mysuru', state: 'Karnataka', distance: 170, transportCost: 4, latitude: 12.2958, longitude: 76.6394 },
  { name: 'Bengaluru APMC', district: 'Bengaluru', state: 'Karnataka', distance: 150, transportCost: 4, latitude: 12.9716, longitude: 77.5946 },
  { name: 'Belagavi Market', district: 'Belagavi', state: 'Karnataka', distance: 230, transportCost: 6, latitude: 15.8497, longitude: 74.4977 },
  { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', distance: 200, transportCost: 5, latitude: 19.9975, longitude: 73.7898 },
  { name: 'Pune APMC', district: 'Pune', state: 'Maharashtra', distance: 180, transportCost: 5, latitude: 18.5204, longitude: 73.8567 },
  { name: 'Solapur APMC', district: 'Solapur', state: 'Maharashtra', distance: 220, transportCost: 6, latitude: 17.6599, longitude: 75.9064 },
  { name: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', distance: 210, transportCost: 5, latitude: 20.1384, longitude: 74.2255 },
  { name: 'Nagpur Market', district: 'Nagpur', state: 'Maharashtra', distance: 250, transportCost: 6, latitude: 21.1458, longitude: 79.0882 },
  { name: 'Mumbai APMC', district: 'Mumbai', state: 'Maharashtra', distance: 140, transportCost: 4, latitude: 19.0760, longitude: 72.8777 },
  { name: 'Guntur Market', district: 'Guntur', state: 'Andhra Pradesh', distance: 160, transportCost: 4, latitude: 16.3067, longitude: 80.4365 },
  { name: 'Kurnool Market', district: 'Kurnool', state: 'Andhra Pradesh', distance: 190, transportCost: 5, latitude: 15.8281, longitude: 78.0373 },
  { name: 'Tirupati Market', district: 'Chittoor', state: 'Andhra Pradesh', distance: 150, transportCost: 4, latitude: 13.6288, longitude: 79.4192 },
  { name: 'Hyderabad Market', district: 'Hyderabad', state: 'Telangana', distance: 180, transportCost: 5, latitude: 17.3850, longitude: 78.4867 },
  { name: 'Warangal Market', district: 'Warangal', state: 'Telangana', distance: 170, transportCost: 4, latitude: 17.9689, longitude: 79.5941 },
  { name: 'Karimnagar Market', district: 'Karimnagar', state: 'Telangana', distance: 160, transportCost: 4, latitude: 18.4386, longitude: 79.1288 },
  { name: 'Kochi Market', district: 'Ernakulam', state: 'Kerala', distance: 140, transportCost: 4, latitude: 9.9312, longitude: 76.2673 },
  { name: 'Thrissur Market', district: 'Thrissur', state: 'Kerala', distance: 150, transportCost: 4, latitude: 10.5276, longitude: 76.2144 },
  { name: 'Kozhikode Market', district: 'Kozhikode', state: 'Kerala', distance: 180, transportCost: 5, latitude: 11.2588, longitude: 75.7804 },
  { name: 'Lucknow Mandi', district: 'Lucknow', state: 'Uttar Pradesh', distance: 120, transportCost: 3, latitude: 26.8467, longitude: 80.9462 },
  { name: 'Kanpur Mandi', district: 'Kanpur', state: 'Uttar Pradesh', distance: 140, transportCost: 4, latitude: 26.4499, longitude: 80.3319 },
  { name: 'Agra Mandi', district: 'Agra', state: 'Uttar Pradesh', distance: 160, transportCost: 4, latitude: 27.1767, longitude: 78.0081 },
  { name: 'Ludhiana Mandi', district: 'Ludhiana', state: 'Punjab', distance: 150, transportCost: 4, latitude: 30.9010, longitude: 75.8573 },
  { name: 'Amritsar Mandi', district: 'Amritsar', state: 'Punjab', distance: 170, transportCost: 4, latitude: 31.6340, longitude: 74.8723 },
  { name: 'Ahmedabad Market', district: 'Ahmedabad', state: 'Gujarat', distance: 140, transportCost: 4, latitude: 23.0225, longitude: 72.5714 },
  { name: 'Rajkot Market', district: 'Rajkot', state: 'Gujarat', distance: 160, transportCost: 4, latitude: 22.3039, longitude: 70.8022 },
  { name: 'Jaipur Mandi', district: 'Jaipur', state: 'Rajasthan', distance: 150, transportCost: 4, latitude: 26.9124, longitude: 75.7873 },
  { name: 'Kota Mandi', district: 'Kota', state: 'Rajasthan', distance: 170, transportCost: 4, latitude: 25.2138, longitude: 75.8648 },
  { name: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', distance: 130, transportCost: 3, latitude: 22.7196, longitude: 75.8577 },
  { name: 'Bhopal Mandi', district: 'Bhopal', state: 'Madhya Pradesh', distance: 140, transportCost: 4, latitude: 23.2599, longitude: 77.4126 }
];

const cropBases = [
  { crop: 'Onion', base: 25 },
  { crop: 'Potato', base: 18 },
  { crop: 'Tomato', base: 35 },
  { crop: 'Pulses', base: 85 },
  { crop: 'Maize', base: 22 },
  { crop: 'Coconut', base: 32 }
];

const generatedMandis = [];
rootMandis.forEach(m => {
  cropBases.forEach(c => {
    generatedMandis.push({
      name: m.name,
      district: m.district,
      state: m.state,
      commodity: c.crop,
      price: c.base + Math.floor(Math.random() * 15),
      distance: m.distance,
      transportCost: m.transportCost,
      latitude: m.latitude,
      longitude: m.longitude,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000))
    });
  });
});

const governmentSchemes = [
  {
    "title": "PM-KISAN",
    "description": "Direct income support for farmer families offering ₹6000 per year paid in three equal installments.",
    "category": "Income Support",
    "state": "All India",
    "eligibility": "Small and Marginal Farmers",
    "benefits": "₹6000/year financial assistance directly deposited into bank accounts.",
    "website": "https://pmkisan.gov.in/"
  },
  {
    "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    "description": "Crop insurance scheme protecting farmers against crop failure due to natural calamities, pests or diseases.",
    "category": "Insurance",
    "state": "All India",
    "eligibility": "All farmers growing notified crops",
    "benefits": "Comprehensive risk coverage and financial support.",
    "website": "https://pmfby.gov.in/"
  },
  {
    "title": "National Agriculture Market (eNAM)",
    "description": "Pan-India electronic trading portal networking the existing APMC mandis to create a unified national agricultural market.",
    "category": "Market Access",
    "state": "All India",
    "eligibility": "All farmers and traders",
    "benefits": "Better price discovery and seamless online agri-trade.",
    "website": "https://enam.gov.in/"
  },
  {
    "title": "Soil Health Card Scheme",
    "description": "Provides farmers with soil nutrient status and recommendations on appropriate dosage of nutrients.",
    "category": "Soil Management",
    "state": "All India",
    "eligibility": "All farmers",
    "benefits": "Improves crop yield through appropriate fertilizer application.",
    "website": "https://soilhealth.dac.gov.in/"
  },
  {
    "title": "Kisan Credit Card (KCC)",
    "description": "Scheme delivering timely agricultural credit to farmers for their cultivation and other short-term needs.",
    "category": "Credit Facility",
    "state": "All India",
    "eligibility": "Farmers, Tenant Farmers, Oral Lessees",
    "benefits": "Short-term credit limits at concessional interest rates.",
    "website": "https://www.myscheme.gov.in/"
  },
  {
    "title": "Agriculture Infrastructure Fund",
    "description": "Medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure.",
    "category": "Infrastructure",
    "state": "All India",
    "eligibility": "Agri-entrepreneurs, Startups, Farmer Groups",
    "benefits": "Interest subvention and credit guarantee.",
    "website": "https://agriinfra.dac.gov.in/"
  },
  {
    "title": "Agmarknet",
    "description": "Agricultural Marketing Information Network linking important agricultural markets across the country.",
    "category": "Market Information",
    "state": "All India",
    "eligibility": "All farmers and market participants",
    "benefits": "Daily prices and arrivals of agricultural commodities.",
    "website": "https://agmarknet.gov.in/"
  },
  {
    "title": "National Bamboo Mission",
    "description": "Holistic growth of bamboo sector supporting area expansion via setting up commercial plantations.",
    "category": "Horticulture",
    "state": "All India",
    "eligibility": "Farmers, Artisans, Entrepreneurs",
    "benefits": "Grants for cultivation, processing and product development.",
    "website": "https://nbm.nic.in/"
  },
  {
    "title": "PM KUSUM",
    "description": "Provides subsidies for solar pumps and grid-connected solar power plants for rural farming setups.",
    "category": "Energy & Irrigation",
    "state": "All India",
    "eligibility": "Individual farmers and Cooperatives",
    "benefits": "Capital subsidy for solar water pumps.",
    "website": "https://pmkusum.mnre.gov.in/"
  }
];

// Perform MongoDB Reset
const Mandi = require('./models/Mandi');
const GovernmentScheme = require('./models/GovernmentScheme');

async function reseed() {
  await mongoose.connect(process.env.MONGO_URI, {});
  console.log('Connected to DB');

  await Mandi.deleteMany({});
  await GovernmentScheme.deleteMany({});
  console.log('Successfully wiped old collections.');

  await Mandi.insertMany(generatedMandis);
  console.log(`Successfully seeded ${generatedMandis.length} dynamic Mandis!`);

  await GovernmentScheme.insertMany(governmentSchemes);
  console.log(`Successfully seeded ${governmentSchemes.length} authentic Government Schemes!`);

  
  // Quick Fix for sampleData.js physical file overriding so the frontend offline mock works
  const fs = require('fs');
  const filePath = './data/sampleData.js';
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex out the mandis block
  let updated = content.replace(/const mandis = \[\s*\{[\s\S]*?\]\n/, 'const mandis = ' + JSON.stringify(generatedMandis, null, 2) + '\n');
  updated = updated.replace(/const governmentSchemes = \[\s*\{[\s\S]*?\]\n/, 'const governmentSchemes = ' + JSON.stringify(governmentSchemes, null, 2) + '\n');
  // Just in case `officialLink` is lingering in the user activities/reports
  updated = updated.replace(/"officialLink"/g, '"website"');
  
  fs.writeFileSync(filePath, updated);
  console.log('Physical sampleData.js successfully patched with authentic values.');

  process.exit(0);
}

reseed().catch(console.error);
