const commodities = [
  { commodity: 'Onion', prices: [{ day: 'Mon', price: 22 }, { day: 'Tue', price: 24 }, { day: 'Wed', price: 23 }, { day: 'Thu', price: 26 }, { day: 'Fri', price: 27 }, { day: 'Sat', price: 29 }, { day: 'Sun', price: 28 }] },
  { commodity: 'Potato', prices: [{ day: 'Mon', price: 14 }, { day: 'Tue', price: 13 }, { day: 'Wed', price: 15 }, { day: 'Thu', price: 16 }, { day: 'Fri', price: 15 }, { day: 'Sat', price: 17 }, { day: 'Sun', price: 18 }] },
  { commodity: 'Pulses', prices: [{ day: 'Mon', price: 88 }, { day: 'Tue', price: 90 }, { day: 'Wed', price: 87 }, { day: 'Thu', price: 92 }, { day: 'Fri', price: 95 }, { day: 'Sat', price: 93 }, { day: 'Sun', price: 96 }] },
  { commodity: 'Maize', prices: [{ day: 'Mon', price: 19 }, { day: 'Tue', price: 20 }, { day: 'Wed', price: 21 }, { day: 'Thu', price: 20 }, { day: 'Fri', price: 22 }, { day: 'Sat', price: 21 }, { day: 'Sun', price: 23 }] },
  { commodity: 'Coconut', prices: [{ day: 'Mon', price: 18 }, { day: 'Tue', price: 19 }, { day: 'Wed', price: 20 }, { day: 'Thu', price: 19 }, { day: 'Fri', price: 21 }, { day: 'Sat', price: 22 }, { day: 'Sun', price: 21 }] },
]

const mandis = [
  { name: 'Koyambedu Market', district: 'Chennai', state: 'Tamil Nadu', commodity: 'Onion', price: 34, distance: 120, transportCost: 3, latitude: 13.0694, longitude: 80.2131 },
  { name: 'Oddanchatram Market', district: 'Dindigul', state: 'Tamil Nadu', commodity: 'Onion', price: 31, distance: 150, transportCost: 4, latitude: 10.4851, longitude: 77.7291 },
  { name: 'Mettupalayam Market', district: 'Coimbatore', state: 'Tamil Nadu', commodity: 'Onion', price: 33, distance: 180, transportCost: 5, latitude: 11.2995, longitude: 76.9362 },
  { name: 'Dindigul Market', district: 'Dindigul', state: 'Tamil Nadu', commodity: 'Onion', price: 32, distance: 140, transportCost: 4, latitude: 10.3673, longitude: 77.9803 },
  { name: 'Coimbatore Market', district: 'Coimbatore', state: 'Tamil Nadu', commodity: 'Onion', price: 34, distance: 100, transportCost: 3, latitude: 11.0168, longitude: 76.9558 },
  { name: 'Madurai Market', district: 'Madurai', state: 'Tamil Nadu', commodity: 'Onion', price: 35, distance: 110, transportCost: 3, latitude: 9.9252, longitude: 78.1198 },
  { name: 'Trichy Market', district: 'Tiruchirappalli', state: 'Tamil Nadu', commodity: 'Onion', price: 33, distance: 130, transportCost: 4, latitude: 10.7905, longitude: 78.7047 },
  { name: 'Salem Market', district: 'Salem', state: 'Tamil Nadu', commodity: 'Onion', price: 32, distance: 160, transportCost: 4, latitude: 11.6643, longitude: 78.1460 },
  { name: 'Erode Market', district: 'Erode', state: 'Tamil Nadu', commodity: 'Onion', price: 31, distance: 190, transportCost: 5, latitude: 11.3410, longitude: 77.7172 },
  { name: 'Hubli Market', district: 'Dharwad', state: 'Karnataka', commodity: 'Onion', price: 29, distance: 210, transportCost: 5, latitude: 15.3647, longitude: 75.1240 },
  { name: 'Mysuru Market', district: 'Mysuru', state: 'Karnataka', commodity: 'Onion', price: 30, distance: 170, transportCost: 4, latitude: 12.2958, longitude: 76.6394 },
  { name: 'Bengaluru APMC', district: 'Bengaluru', state: 'Karnataka', commodity: 'Onion', price: 34, distance: 150, transportCost: 4, latitude: 12.9716, longitude: 77.5946 },
  { name: 'Belagavi Market', district: 'Belagavi', state: 'Karnataka', commodity: 'Onion', price: 28, distance: 230, transportCost: 6, latitude: 15.8497, longitude: 74.4977 },
  { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Onion', price: 31, distance: 200, transportCost: 5, latitude: 19.9975, longitude: 73.7898 },
  { name: 'Pune APMC', district: 'Pune', state: 'Maharashtra', commodity: 'Onion', price: 34, distance: 180, transportCost: 5, latitude: 18.5204, longitude: 73.8567 },
  { name: 'Solapur APMC', district: 'Solapur', state: 'Maharashtra', commodity: 'Onion', price: 33, distance: 220, transportCost: 6, latitude: 17.6599, longitude: 75.9064 },
  { name: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Onion', price: 35, distance: 210, transportCost: 5, latitude: 20.1384, longitude: 74.2255 },
  { name: 'Nagpur Market', district: 'Nagpur', state: 'Maharashtra', commodity: 'Onion', price: 32, distance: 250, transportCost: 6, latitude: 21.1458, longitude: 79.0882 },
  { name: 'Mumbai APMC', district: 'Mumbai', state: 'Maharashtra', commodity: 'Onion', price: 36, distance: 140, transportCost: 4, latitude: 19.0760, longitude: 72.8777 },
  { name: 'Guntur Market', district: 'Guntur', state: 'Andhra Pradesh', commodity: 'Onion', price: 31, distance: 160, transportCost: 4, latitude: 16.3067, longitude: 80.4365 },
  { name: 'Kurnool Market', district: 'Kurnool', state: 'Andhra Pradesh', commodity: 'Onion', price: 30, distance: 190, transportCost: 5, latitude: 15.8281, longitude: 78.0373 },
  { name: 'Tirupati Market', district: 'Chittoor', state: 'Andhra Pradesh', commodity: 'Onion', price: 28, distance: 150, transportCost: 4, latitude: 13.6288, longitude: 79.4192 },
  { name: 'Hyderabad Market', district: 'Hyderabad', state: 'Telangana', commodity: 'Onion', price: 33, distance: 180, transportCost: 5, latitude: 17.3850, longitude: 78.4867 },
  { name: 'Warangal Market', district: 'Warangal', state: 'Telangana', commodity: 'Onion', price: 29, distance: 170, transportCost: 4, latitude: 17.9689, longitude: 79.5941 },
  { name: 'Karimnagar Market', district: 'Karimnagar', state: 'Telangana', commodity: 'Onion', price: 30, distance: 160, transportCost: 4, latitude: 18.4386, longitude: 79.1288 },
  { name: 'Kochi Market', district: 'Ernakulam', state: 'Kerala', commodity: 'Onion', price: 36, distance: 140, transportCost: 4, latitude: 9.9312, longitude: 76.2673 },
  { name: 'Thrissur Market', district: 'Thrissur', state: 'Kerala', commodity: 'Onion', price: 35, distance: 150, transportCost: 4, latitude: 10.5276, longitude: 76.2144 },
  { name: 'Kozhikode Market', district: 'Kozhikode', state: 'Kerala', commodity: 'Onion', price: 34, distance: 180, transportCost: 5, latitude: 11.2588, longitude: 75.7804 },
  { name: 'Lucknow Mandi', district: 'Lucknow', state: 'Uttar Pradesh', commodity: 'Onion', price: 32, distance: 120, transportCost: 3, latitude: 26.8467, longitude: 80.9462 },
  { name: 'Kanpur Mandi', district: 'Kanpur', state: 'Uttar Pradesh', commodity: 'Onion', price: 29, distance: 140, transportCost: 4, latitude: 26.4499, longitude: 80.3319 },
  { name: 'Agra Mandi', district: 'Agra', state: 'Uttar Pradesh', commodity: 'Onion', price: 31, distance: 160, transportCost: 4, latitude: 27.1767, longitude: 78.0081 },
  { name: 'Ludhiana Mandi', district: 'Ludhiana', state: 'Punjab', commodity: 'Onion', price: 31, distance: 150, transportCost: 4, latitude: 30.9010, longitude: 75.8573 },
  { name: 'Amritsar Mandi', district: 'Amritsar', state: 'Punjab', commodity: 'Onion', price: 33, distance: 170, transportCost: 4, latitude: 31.6340, longitude: 74.8723 },
  { name: 'Ahmedabad Market', district: 'Ahmedabad', state: 'Gujarat', commodity: 'Onion', price: 34, distance: 140, transportCost: 4, latitude: 23.0225, longitude: 72.5714 },
  { name: 'Rajkot Market', district: 'Rajkot', state: 'Gujarat', commodity: 'Onion', price: 33, distance: 160, transportCost: 4, latitude: 22.3039, longitude: 70.8022 },
  { name: 'Jaipur Mandi', district: 'Jaipur', state: 'Rajasthan', commodity: 'Onion', price: 31, distance: 150, transportCost: 4, latitude: 26.9124, longitude: 75.7873 },
  { name: 'Kota Mandi', district: 'Kota', state: 'Rajasthan', commodity: 'Onion', price: 32, distance: 170, transportCost: 4, latitude: 25.2138, longitude: 75.8648 },
  { name: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', commodity: 'Onion', price: 32, distance: 130, transportCost: 3, latitude: 22.7196, longitude: 75.8577 },
  { name: 'Bhopal Mandi', district: 'Bhopal', state: 'Madhya Pradesh', commodity: 'Onion', price: 33, distance: 140, transportCost: 4, latitude: 23.2599, longitude: 77.4126 },
]

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
    "title": "PM Kusum",
    "description": "Provides subsidies for solar pumps and grid-connected solar power plants for rural farming setups.",
    "category": "Energy & Irrigation",
    "state": "All India",
    "eligibility": "Individual farmers and Cooperatives",
    "benefits": "Capital subsidy for solar water pumps.",
    "website": "https://pmkusum.mnre.gov.in/"
  }
];

const users = [
  {
    name: 'Demo Farmer',
    phone: '9999999999',
    password: 'password123',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Lasalgaon',
    primaryCrop: 'Onion',
    farmSize: 5,
    preferredLanguage: 'English',
  },
]

const activities = [
  { activityType: 'price', commodity: 'Onion', description: 'Checked Onion price - Rs.28/kg on Sun', metadata: { price: 28, day: 'Sun' }, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
  { activityType: 'prediction', commodity: 'Onion', description: 'AI predicted Onion price - Rs.28.42/kg (91% confidence) for day 8', metadata: { predictedPrice: 28.42, confidence: 91, day: 8 }, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { activityType: 'weather', commodity: 'Onion', description: 'Checked Delhi weather for crop planning', metadata: { city: 'Delhi' }, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  { activityType: 'mandi', commodity: 'Onion', description: 'Searched best mandi for Onion - top: Koyambedu Market at Rs.34/kg', metadata: { topMandi: 'Koyambedu Market', topPrice: 34, count: 2 }, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { activityType: 'profit', commodity: 'Onion', description: 'Profit simulation completed for Onion', metadata: { roi: 18, recommendation: 'Hold' }, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { activityType: 'government', description: 'Viewed Government Schemes - 3 schemes available', metadata: { count: 3 }, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
]

const notifications = [
  { title: 'Onion Price Rising', message: 'AI predicts Onion price may increase. Consider holding your stock.', type: 'price', commodity: 'Onion', priority: 'medium' },
  { title: 'New Government Scheme Available', message: 'PM-KISAN information is available in the Government Schemes section.', type: 'government', priority: 'medium' },
  { title: 'Mandi Price Update', message: 'Koyambedu Market is showing a strong Onion price today.', type: 'mandi', commodity: 'Onion', priority: 'high' },
]

const analytics = [
  { key: 'dashboard-defaults', value: { seeded: true, source: 'empty database bootstrap' } },
]

const reports = [
  { title: 'Prediction Report', type: 'predictions', description: 'AI price predictions and commodity history.', endpoint: '/api/reports/predictions/pdf' },
  { title: 'Analytics Report', type: 'analytics', description: 'Platform usage summary and insights.', endpoint: '/api/reports/analytics/pdf' },
  { title: 'Notifications Report', type: 'notifications', description: 'Alerts with priority and read status.', endpoint: '/api/reports/notifications/pdf' },
]

module.exports = {
  commodities,
  mandis,
  governmentSchemes,
  users,
  activities,
  notifications,
  analytics,
  reports,
}
