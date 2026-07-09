const GovernmentScheme = require("../models/GovernmentScheme");
const Activity         = require("../models/Activity");

const MSP_DATA = [
  { commodity: "Wheat",        msp: 2425 },
  { commodity: "Paddy",        msp: 2369 },
  { commodity: "Cotton",       msp: 7710 },
  { commodity: "Maize",        msp: 2090 },
  { commodity: "Soybean",      msp: 4892 },
  { commodity: "Groundnut",    msp: 6783 },
  { commodity: "Sunflower",    msp: 7280 },
  { commodity: "Mustard",      msp: 5950 },
  { commodity: "Tur (Arhar)",  msp: 7550 },
  { commodity: "Moong",        msp: 8682 },
  { commodity: "Urad",         msp: 7400 },
  { commodity: "Gram (Chana)", msp: 5440 },
  { commodity: "Jowar",        msp: 3371 },
  { commodity: "Bajra",        msp: 2625 },
  { commodity: "Ragi",         msp: 3846 },
  { commodity: "Onion",        msp: "Market Driven" },
  { commodity: "Potato",       msp: "Market Driven" },
  { commodity: "Tomato",       msp: "Market Driven" },
];

const getAllSchemes = async (req, res) => {
  try {
    const schemes = await GovernmentScheme.find().sort({ createdAt: -1 }).limit(8);
    res.json(schemes);
    Activity.create({
      activityType: 'government',
      description:  `Viewed Government Schemes - ${schemes.length} scheme${schemes.length !== 1 ? 's' : ''} available`,
      metadata:     { count: schemes.length },
    }).catch(() => {})
  } catch (error) {
    console.error("[Schemes Fallback Triggered]", error.message);
    try {
      const { governmentSchemes } = require('../data/sampleData.js');
      return res.json(governmentSchemes.slice(0, 8));
    } catch(e) {
      return res.json([]);
    }
  }
};

const getSchemeById = async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  } catch (error) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] });
  }
};

const searchSchemes = async (req, res) => {
  try {
    const { q = "", state = "", category = "" } = req.query;
    const filter = {};
    if (q)        filter.$or = [
      { title:       { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { category:    { $regex: q, $options: "i" } },
    ];
    if (state)    filter.state    = { $regex: state,    $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };

    const schemes = await GovernmentScheme.find(filter).sort({ createdAt: -1 }).limit(8);
    res.json(schemes);
  } catch (error) {
    console.error("[Schemes Search Fallback Triggered]", error.message);
    try {
      const { governmentSchemes } = require('../data/sampleData.js');
      return res.json(governmentSchemes.slice(0, 8));
    } catch(e) {
      return res.json([]);
    }
  }
};

const getMSPPrices = (req, res) => {
  res.json(MSP_DATA);
};

module.exports = { getAllSchemes, getSchemeById, searchSchemes, getMSPPrices };
