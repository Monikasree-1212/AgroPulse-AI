const fs = require('fs');
const file = 'backend/data/sampleData.js';
let content = fs.readFileSync(file, 'utf8');

const newBlock = `const governmentSchemes = [
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
    "title": "PM Kusum",
    "description": "Provides subsidies for solar pumps and grid-connected solar power plants for rural farming setups.",
    "category": "Energy & Irrigation",
    "state": "All India",
    "eligibility": "Individual farmers and Cooperatives",
    "benefits": "Capital subsidy for solar water pumps.",
    "website": "https://pmkusum.mnre.gov.in/"
  }
];

`;

let parts = content.split('const governmentSchemes = [');
if (parts.length > 1) {
  let left = parts[0];
  let rightParts = parts[1].split('const users = [');
  if (rightParts.length > 1) {
    let right = 'const users = [' + rightParts.slice(1).join('const users = [');
    content = left + newBlock + right;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully replaced sampleData.js governmentSchemes directly.');
  } else {
    console.log('Could not find const users = [');
  }
} else {
  console.log('Could not find const governmentSchemes block.');
}
