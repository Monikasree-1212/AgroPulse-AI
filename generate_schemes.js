const fs = require('fs');

const realSchemeNames = [
  ["PM-KISAN", "Income Support"],
  ["PMFBY (Pradhan Mantri Fasal Bima Yojana)", "Insurance"],
  ["Kisan Credit Card (KCC)", "Loan"],
  ["Soil Health Card Scheme", "Technology"],
  ["Paramparagat Krishi Vikas Yojana", "Organic Farming"],
  ["PM Krishi Sinchai Yojana", "Technology"],
  ["National Agriculture Market (eNAM)", "Technology"],
  ["National Mission for Sustainable Ag (NMSA)", "Technology"],
  ["Sub-Mission on Agricultural Mechanization", "Subsidy"],
  ["Rashtriya Krishi Vikas Yojana (RKVY)", "Subsidy"],
  ["Agriculture Infrastructure Fund", "Loan"],
  ["National Food Security Mission", "Subsidy"],
  ["Gramin Bhandaran Yojana", "Subsidy"],
  ["Livestock Insurance Scheme", "Insurance"],
  ["Dairy Entrepreneurship Development Scheme", "Youth"],
  ["Fisheries and Aquaculture Infrastructure Dev", "Subsidy"],
  ["Pradhan Mantri Kisan Maandhan Yojana", "Income Support"],
  ["National Scheme on Welfare of Fishermen", "SC/ST"],
  ["Micro Irrigation Fund", "Loan"],
  ["PM Kusum (Kisan Urja Suraksha)", "Solar"],
  ["Gobar Dhan Yojana", "Organic Farming"],
  ["Mahila Kisan Sashaktikaran Pariyojana", "Women Farmers"],
  ["Deen Dayal Upadhyaya Grameen Kaushalya Yojana", "Youth"],
  ["Bhartiya Prakritik Krishi Paddhati", "Organic Farming"],
  ["Agri-Clinics and Agri-Business Centres", "Youth"],
  ["Mission for Integrated Development of Horticulture", "Subsidy"],
  ["National Bamboo Mission", "Subsidy"],
  ["National Project on Organic Farming", "Organic Farming"],
  ["Fertilizer Subsidy Scheme", "Fertilizer"],
  ["Nutrient Based Subsidy (NBS) Scheme", "Fertilizer"],
  ["City Compost Scheme", "Fertilizer"],
  ["Capital Investment Subsidy for Commercial Horticulture", "Subsidy"],
  ["Venture Capital Assistance Scheme", "Loan"],
  ["Weather Based Crop Insurance Scheme", "Insurance"],
  ["Coconut Palm Insurance Scheme", "Insurance"],
  ["Stand-Up India Scheme for Agri Startups", "SC/ST"],
  ["National SC/ST Hub for Agri Enterprises", "SC/ST"],
  ["Women Entrepreneurship Platform (WEP)", "Women Farmers"],
  ["Solar Pump Subsidy Program", "Solar"],
  ["Mukhya Mantri Krishi Ashirwad Yojana", "Income Support"],
  ["Rythu Bandhu Scheme", "Subsidy"],
  ["Kalia Scheme", "Subsidy"],
  ["Bhavantar Bhugtan Yojana", "Subsidy"]
];

const schemes = realSchemeNames.map(([title, cat], idx) => ({
  title: title,
  description: `A realistic government initiative focusing on ${cat.toLowerCase()} and agricultural development. Ideal for eligible farmers applying for national and state benefits.`,
  category: cat,
  state: idx % 3 === 0 ? "Maharashtra" : idx % 2 === 0 ? "Tamil Nadu" : "All India",
  eligibility: `All farmers eligible for ${cat} schemes in notified regions.`,
  benefits: `Direct financial assistance, subsidized rates, or insurance coverage based on ${cat}.`,
  officialLink: "https://agricoop.nic.in"
}));

const content = fs.readFileSync('backend/data/sampleData.js', 'utf8');

// Replace the existing governmentSchemes array in sampleData.js
const updatedContent = content.replace(
  /const governmentSchemes = \[\s*\{[\s\S]*?\n\]/m, 
  `const governmentSchemes = ${JSON.stringify(schemes, null, 2)}`
);

fs.writeFileSync('backend/data/sampleData.js', updatedContent);
console.log('Successfully updated sampleData.js with 40+ schemes.');
