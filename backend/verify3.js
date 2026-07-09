require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');

async function verify() {
  await mongoose.connect(process.env.MONGO_URI, {});
  const db = mongoose.connection.db;
  
  const mandiCount = await db.collection('mandis').countDocuments();
  const m_onion = await db.collection('mandis').countDocuments({commodity: { $regex: /onion/i }});
  const m_potato = await db.collection('mandis').countDocuments({commodity: { $regex: /potato/i }});
  
  let out = `Total: ${mandiCount}\nOnion: ${m_onion}\nPotato: ${m_potato}\n`;
  
  const schemes = await db.collection('governmentschemes').find({}).toArray();
  const activeFields = schemes.filter(s => s.website).length;
  out += `Schemes: ${schemes.length}\nWebsites: ${activeFields}\n`;
  if (schemes.length > 0) {
    out += `Sample: ${schemes[0].website}\n`;
  }

  try {
    const res = await axios.get('http://localhost:5000/api/mandis/recommendation?state=Tamil%20Nadu&district=Coimbatore&crop=Potato');
    out += `API Count: ${res.data.data.length}\n`;
    if(res.data.data.length > 0) {
      out += `First Result: ${res.data.data[0].marketName} - ${res.data.data[0].commodity} - Rs.${res.data.data[0].marketPrice}\n`;
    }
  } catch(e) {
    out += `API Error: ${e.message}\n`;
  }
  
  fs.writeFileSync('clean_output.txt', out, 'utf8');
  process.exit(0);
}

verify().catch(console.error);
