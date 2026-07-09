require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

async function verify() {
  await mongoose.connect(process.env.MONGO_URI, {});
  const db = mongoose.connection.db;
  
  const mandiCount = await db.collection('mandis').countDocuments();
  const m_onion = await db.collection('mandis').countDocuments({commodity: { $regex: /onion/i }});
  const m_potato = await db.collection('mandis').countDocuments({commodity: { $regex: /potato/i }});
  
  console.log('--- MongoDB MANDIS ---');
  console.log('Total:', mandiCount, '| Onion:', m_onion, '| Potato:', m_potato);
  
  const schemes = await db.collection('governmentschemes').find({}).toArray();
  const activeFields = schemes.filter(s => s.website).length;
  console.log('--- MongoDB SCHEMES ---');
  console.log(`Total Schemes: ${schemes.length} | With Website: ${activeFields}`);
  if (schemes.length > 0) {
    console.log('Sample URL 0:', schemes[0].website);
    console.log('Sample URL 1:', schemes[1] ? schemes[1].website : 'N/A');
  }

  console.log('--- LOCAL API TEST ---');
  try {
    const res = await axios.get('http://localhost:5000/api/mandis/recommendation?state=Tamil%20Nadu&district=Coimbatore&crop=Potato');
    console.log('Results Returned:', res.data.data.length);
    if(res.data.data.length > 0) {
      console.log('Top Result:', {
        marketName: res.data.data[0].marketName,
        commodity: res.data.data[0].commodity,
        price: res.data.data[0].marketPrice,
        profit: res.data.data[0].expectedProfit
      });
    }
  } catch(e) {
    console.log('API Error:', e.message);
  }
  
  process.exit(0);
}

verify().catch(console.error);
