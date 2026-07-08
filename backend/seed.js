const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Commodity       = require("./models/Commodity");
const Mandi           = require("./models/Mandi");
const GovernmentScheme = require("./models/GovernmentScheme");

const data = [
  {
    commodity: "Onion",
    prices: [
      { day: "Mon", price: 22 },
      { day: "Tue", price: 24 },
      { day: "Wed", price: 23 },
      { day: "Thu", price: 26 },
      { day: "Fri", price: 27 },
      { day: "Sat", price: 29 },
      { day: "Sun", price: 28 },
    ],
  },
  {
    commodity: "Potato",
    prices: [
      { day: "Mon", price: 14 },
      { day: "Tue", price: 13 },
      { day: "Wed", price: 15 },
      { day: "Thu", price: 16 },
      { day: "Fri", price: 15 },
      { day: "Sat", price: 17 },
      { day: "Sun", price: 18 },
    ],
  },
  {
    commodity: "Pulses",
    prices: [
      { day: "Mon", price: 88 },
      { day: "Tue", price: 90 },
      { day: "Wed", price: 87 },
      { day: "Thu", price: 92 },
      { day: "Fri", price: 95 },
      { day: "Sat", price: 93 },
      { day: "Sun", price: 96 },
    ],
  },
  {
    commodity: "Maize",
    prices: [
      { day: "Mon", price: 19 },
      { day: "Tue", price: 20 },
      { day: "Wed", price: 21 },
      { day: "Thu", price: 20 },
      { day: "Fri", price: 22 },
      { day: "Sat", price: 21 },
      { day: "Sun", price: 23 },
    ],
  },
  {
    commodity: "Coconut",
    prices: [
      { day: "Mon", price: 18 },
      { day: "Tue", price: 19 },
      { day: "Wed", price: 20 },
      { day: "Thu", price: 19 },
      { day: "Fri", price: 21 },
      { day: "Sat", price: 22 },
      { day: "Sun", price: 21 },
    ],
  },
];

const mandiData = [
  // Onion
  { name: "Koyambedu Market",  district: "Chennai",    state: "Tamil Nadu",    commodity: "Onion", price: 34, distance: 120, transportCost: 3, latitude: 13.0694, longitude: 80.2131 },
  { name: "Nashik APMC",       district: "Nashik",     state: "Maharashtra",   commodity: "Onion", price: 31, distance: 200, transportCost: 5, latitude: 19.9975, longitude: 73.7898 },
  { name: "Lasalgaon Mandi",   district: "Nashik",     state: "Maharashtra",   commodity: "Onion", price: 30, distance: 220, transportCost: 6, latitude: 20.1167, longitude: 74.0833 },
  { name: "Pune APMC",         district: "Pune",       state: "Maharashtra",   commodity: "Onion", price: 32, distance: 180, transportCost: 4, latitude: 18.5204, longitude: 73.8567 },
  { name: "Hubli Market",      district: "Dharwad",    state: "Karnataka",     commodity: "Onion", price: 29, distance: 300, transportCost: 7, latitude: 15.3647, longitude: 75.1240 },
  { name: "Solapur APMC",      district: "Solapur",    state: "Maharashtra",   commodity: "Onion", price: 28, distance: 250, transportCost: 5, latitude: 17.6868, longitude: 75.9064 },
  // Potato
  { name: "Agra Mandi",        district: "Agra",       state: "Uttar Pradesh", commodity: "Potato", price: 18, distance: 80,  transportCost: 2, latitude: 27.1767, longitude: 78.0081 },
  { name: "Delhi Azadpur",     district: "Delhi",      state: "Delhi",         commodity: "Potato", price: 20, distance: 50,  transportCost: 1, latitude: 28.7041, longitude: 77.1025 },
  { name: "Kolkata Koley",     district: "Kolkata",    state: "West Bengal",   commodity: "Potato", price: 17, distance: 400, transportCost: 8, latitude: 22.5726, longitude: 88.3639 },
  { name: "Patna Mandi",       district: "Patna",      state: "Bihar",         commodity: "Potato", price: 16, distance: 300, transportCost: 6, latitude: 25.5941, longitude: 85.1376 },
  { name: "Lucknow APMC",      district: "Lucknow",    state: "Uttar Pradesh", commodity: "Potato", price: 19, distance: 120, transportCost: 3, latitude: 26.8467, longitude: 80.9462 },
  { name: "Kanpur Mandi",      district: "Kanpur",     state: "Uttar Pradesh", commodity: "Potato", price: 17, distance: 150, transportCost: 4, latitude: 26.4499, longitude: 80.3319 },
  // Pulses
  { name: "Indore Grain Market", district: "Indore",   state: "Madhya Pradesh",commodity: "Pulses", price: 98, distance: 160, transportCost: 4, latitude: 22.7196, longitude: 75.8577 },
  { name: "Nagpur APMC",       district: "Nagpur",     state: "Maharashtra",   commodity: "Pulses", price: 102,distance: 200, transportCost: 5, latitude: 21.1458, longitude: 79.0882 },
  { name: "Bhopal Mandi",      district: "Bhopal",     state: "Madhya Pradesh",commodity: "Pulses", price: 95, distance: 180, transportCost: 5, latitude: 23.2599, longitude: 77.4126 },
  { name: "Akola Market",      district: "Akola",      state: "Maharashtra",   commodity: "Pulses", price: 100,distance: 220, transportCost: 6, latitude: 20.7002, longitude: 77.0082 },
  { name: "Latur APMC",        district: "Latur",      state: "Maharashtra",   commodity: "Pulses", price: 97, distance: 240, transportCost: 6, latitude: 18.4088, longitude: 76.5604 },
  { name: "Gulbarga Mandi",    district: "Kalaburagi", state: "Karnataka",     commodity: "Pulses", price: 96, distance: 280, transportCost: 7, latitude: 17.3297, longitude: 76.8343 },
  // Maize
  { name: "Davangere APMC",    district: "Davangere",  state: "Karnataka",     commodity: "Maize",  price: 24, distance: 140, transportCost: 3, latitude: 14.4644, longitude: 75.9218 },
  { name: "Nizamabad Market",  district: "Nizamabad",  state: "Telangana",     commodity: "Maize",  price: 26, distance: 190, transportCost: 4, latitude: 18.6725, longitude: 78.0941 },
  { name: "Gulbarga Maize",    district: "Kalaburagi", state: "Karnataka",     commodity: "Maize",  price: 22, distance: 210, transportCost: 5, latitude: 17.3297, longitude: 76.8343 },
  { name: "Karimnagar Mandi",  district: "Karimnagar", state: "Telangana",     commodity: "Maize",  price: 25, distance: 170, transportCost: 4, latitude: 18.4386, longitude: 79.1288 },
  { name: "Bellary APMC",      district: "Bellary",    state: "Karnataka",     commodity: "Maize",  price: 23, distance: 230, transportCost: 5, latitude: 15.1394, longitude: 76.9214 },
  { name: "Warangal Market",   district: "Warangal",   state: "Telangana",     commodity: "Maize",  price: 24, distance: 200, transportCost: 5, latitude: 17.9784, longitude: 79.5941 },
  // Coconut
  { name: "Pollachi APMC",     district: "Coimbatore",       state: "Tamil Nadu",  commodity: "Coconut", price: 22, distance: 80,  transportCost: 2, latitude: 10.6597, longitude: 77.0071 },
  { name: "Coimbatore Market", district: "Coimbatore",       state: "Tamil Nadu",  commodity: "Coconut", price: 24, distance: 100, transportCost: 3, latitude: 11.0168, longitude: 76.9558 },
  { name: "Ernakulam APMC",    district: "Ernakulam",        state: "Kerala",      commodity: "Coconut", price: 20, distance: 150, transportCost: 4, latitude: 9.9816,  longitude: 76.2999 },
  { name: "Thrissur Market",   district: "Thrissur",         state: "Kerala",      commodity: "Coconut", price: 21, distance: 130, transportCost: 3, latitude: 10.5276, longitude: 76.2144 },
  { name: "Mangalore APMC",    district: "Dakshina Kannada", state: "Karnataka",   commodity: "Coconut", price: 19, distance: 200, transportCost: 5, latitude: 12.9141, longitude: 74.8560 },
  { name: "Udupi Market",      district: "Udupi",            state: "Karnataka",   commodity: "Coconut", price: 20, distance: 180, transportCost: 4, latitude: 13.3409, longitude: 74.7421 },
];

const schemeData = [
  {
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Provides income support of ₹6,000 per year to all landholding farmer families across India in three equal instalments of ₹2,000 every four months.",
    category: "Income Support",
    state: "All India",
    eligibility: "All landholding farmer families with cultivable land. Excludes institutional landholders and certain high-income categories.",
    benefits: "₹6,000 per year direct bank transfer in 3 instalments of ₹2,000 each.",
    officialLink: "https://pmkisan.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    description: "A crop insurance scheme that provides financial support to farmers suffering crop loss or damage due to unforeseen events like natural calamities, pests and diseases.",
    category: "Crop Insurance",
    state: "All India",
    eligibility: "All farmers growing notified crops in notified areas. Compulsory for loanee farmers, voluntary for non-loanee farmers.",
    benefits: "Insurance coverage and financial support for crop loss. Premium as low as 1.5% for Rabi, 2% for Kharif, and 5% for commercial crops.",
    officialLink: "https://pmfby.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "Kisan Credit Card (KCC)",
    description: "Provides farmers with affordable credit for agricultural needs including crop cultivation, post-harvest expenses, maintenance of farm assets, and allied activities.",
    category: "Credit & Finance",
    state: "All India",
    eligibility: "All farmers including individual, joint borrowers, tenant farmers, oral lessees, share croppers, and SHGs of farmers.",
    benefits: "Revolving credit up to ₹3 lakh at 4% interest rate per annum with interest subvention. Flexible repayment based on harvest and marketing period.",
    officialLink: "https://www.nabard.org/content.aspx?id=572",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "Soil Health Card Scheme",
    description: "Issues Soil Health Cards to farmers carrying crop-wise recommendations of nutrients and fertilizers required for individual farms to help improve productivity.",
    category: "Soil & Fertilizer",
    state: "All India",
    eligibility: "All farmers across India. Soil testing is done once every two years for each farm holding.",
    benefits: "Free soil testing and Soil Health Card with fertilizer recommendations. Helps reduce input costs and improve yield by up to 10-15%.",
    officialLink: "https://soilhealth.dac.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "eNAM (National Agriculture Market)",
    description: "A pan-India electronic trading portal that networks existing APMC mandis to create a unified national market for agricultural commodities.",
    category: "Market Access",
    state: "All India",
    eligibility: "All farmers, traders, and buyers registered with their local APMC mandi. Registration is free for farmers.",
    benefits: "Access to wider market, transparent price discovery, online payment, reduced transaction costs, and better price realisation for produce.",
    officialLink: "https://enam.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "National Horticulture Mission (NHM)",
    description: "Promotes holistic growth of the horticulture sector through area expansion, productivity improvement, post-harvest management, and market development.",
    category: "Horticulture",
    state: "All India",
    eligibility: "Farmers growing fruits, vegetables, flowers, spices, mushrooms, and plantation crops. Implemented through State Horticulture Missions.",
    benefits: "Subsidies on planting material, protected cultivation, post-harvest infrastructure, cold storage, and market linkages. Up to 50% subsidy on many components.",
    officialLink: "https://nhm.nic.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotes organic farming through adoption of organic village by cluster approach and PGS certification to improve soil health and reduce chemical input dependency.",
    category: "Organic Farming",
    state: "All India",
    eligibility: "Farmers willing to adopt organic farming practices. Groups of 50 farmers forming a cluster of 50 acres are eligible.",
    benefits: "₹50,000 per hectare over 3 years for organic inputs, certification, and marketing. Includes ₹31,000 for organic inputs and ₹8,800 for value addition.",
    officialLink: "https://pgsindia-ncof.gov.in/PKVY/Index.aspx",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "Agriculture Infrastructure Fund (AIF)",
    description: "A financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets through interest subvention and credit guarantee.",
    category: "Infrastructure",
    state: "All India",
    eligibility: "Farmers, FPOs, PACS, Marketing Cooperative Societies, SHGs, Joint Liability Groups, Agri-entrepreneurs, and Start-ups.",
    benefits: "Loans up to ₹2 crore with 3% interest subvention per annum for 7 years. Credit guarantee coverage under CGTMSE for loans up to ₹2 crore.",
    officialLink: "https://agriinfra.dac.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "PM Krishi Sinchai Yojana (PMKSY)",
    description: "Aims to achieve convergence of investments in irrigation at the field level, expand cultivable area under assured irrigation, and improve water use efficiency.",
    category: "Irrigation",
    state: "All India",
    eligibility: "All farmers, particularly those in water-stressed regions. Priority to small and marginal farmers for micro-irrigation subsidies.",
    benefits: "55% subsidy for small/marginal farmers and 45% for other farmers on micro-irrigation (drip and sprinkler). Har Khet Ko Pani and More Crop Per Drop.",
    officialLink: "https://pmksy.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
  {
    title: "National Food Security Mission (NFSM)",
    description: "Aims to increase production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement in a sustainable manner.",
    category: "Food Security",
    state: "All India",
    eligibility: "Farmers in identified districts growing rice, wheat, pulses, coarse cereals, and commercial crops like cotton, jute, and sugarcane.",
    benefits: "Subsidised seeds, farm machinery, plant protection equipment, and training. Cluster demonstrations and technology dissemination support.",
    officialLink: "https://nfsm.gov.in",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await Commodity.deleteMany({});
    console.log("Existing commodity data cleared");
    await Commodity.insertMany(data);
    console.log("Commodities seeded successfully");

    await Mandi.deleteMany({});
    console.log("Existing mandi data cleared");
    await Mandi.insertMany(mandiData);
    console.log("Mandis seeded successfully");

    await GovernmentScheme.deleteMany({});
    console.log("Existing scheme data cleared");
    await GovernmentScheme.insertMany(schemeData);
    console.log("Government schemes seeded successfully");
  } catch (error) {
    console.error("Seed Error:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seed();
