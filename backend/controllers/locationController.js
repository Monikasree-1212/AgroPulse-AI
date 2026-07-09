const Mandi = require("../models/Mandi");

/* Haversine formula - returns distance in km */
function haversine(lat1, lon1, lat2, lon2) {
  const R   = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

/* Estimate travel time string from km */
function travelTime(km) {
  const hrs  = km / 50;           // avg 50 km/h
  const h    = Math.floor(hrs);
  const m    = Math.round((hrs - h) * 60);
  if (h === 0)          return `${m} min`;
  if (m < 5)            return `${h} hr`;
  return `${h} hr ${m} min`;
}

const getNearbyMandis = async (req, res) => {
  const { latitude, longitude, commodity } = req.body;

  if (latitude == null || longitude == null || !commodity)
    return res.status(400).json({ message: "latitude, longitude and commodity are required." });

  if (typeof latitude !== "number" || typeof longitude !== "number")
    return res.status(400).json({ message: "latitude and longitude must be numbers." });

  try {
    const mandis = await Mandi.find({
      commodity: { $regex: new RegExp(`^${commodity}$`, "i") },
    });

    if (!mandis.length)
      return res.status(404).json({ message: `No mandis found for commodity: ${commodity}` });

    const QUANTITY       = 1000;   // default reference quantity (kg)
    const COST_PER_KM    = 12;     // Rs. per km transport cost estimate

    const results = mandis.map((m) => {
      const dist          = haversine(latitude, longitude, m.latitude, m.longitude);
      const transportCost = Math.round(dist * COST_PER_KM);
      const expectedProfit = (m.price * QUANTITY) - transportCost;

      return {
        _id:            m._id,
        name:           m.name,
        city:           m.district,
        state:          m.state,
        distance:       dist,
        travelTime:     travelTime(dist),
        transportCost,
        marketPrice:    m.price,
        expectedProfit,
        latitude:       m.latitude,
        longitude:      m.longitude,
      };
    });

    /* Sort: nearest first, then by highest profit */
    results.sort((a, b) => a.distance - b.distance || b.expectedProfit - a.expectedProfit);

    res.json(results);
  } catch (error) {
    res.status(200).json({ success: false, message: 'DB Fallback', data: [] });
  }
};

module.exports = { getNearbyMandis };
