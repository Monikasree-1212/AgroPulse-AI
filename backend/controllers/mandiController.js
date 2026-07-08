const Mandi    = require("../models/Mandi");
const Activity = require("../models/Activity");

/* ── Haversine distance in km ── */
function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

/* ── Estimate travel time string ── */
function travelTime(km) {
  const hrs = km / 50;
  const h   = Math.floor(hrs);
  const m   = Math.round((hrs - h) * 60);
  if (h === 0) return `${m} min`;
  if (m < 5)   return `${h} hr`;
  return `${h} hr ${m} min`;
}

const getAllMandis = async (req, res) => {
  try {
    res.json(await Mandi.find());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMandisByCommodity = async (req, res) => {
  try {
    const mandis = await Mandi.find({
      commodity: { $regex: new RegExp(`^${req.params.commodity}$`, "i") },
    });
    if (!mandis.length)
      return res.status(404).json({ message: "No mandis found for this commodity" });
    res.json(mandis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * GET /api/mandis/recommend/:commodity?lat=<lat>&lon=<lon>
 *
 * With lat/lon  → sort by real distance (nearest first), profit as tiebreaker.
 *                 Sets isFallback=true when the nearest mandi is > 500 km away.
 * Without lat/lon → original behaviour: sort by profit descending.
 */
const recommendMandis = async (req, res) => {
  try {
    const { commodity } = req.params;
    const lat = req.query.lat !== undefined ? parseFloat(req.query.lat) : null;
    const lon = req.query.lon !== undefined ? parseFloat(req.query.lon) : null;
    const hasLocation = lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon);

    console.log(`[Mandi] recommend: commodity=${commodity} lat=${lat} lon=${lon} hasLocation=${hasLocation}`);

    const mandis = await Mandi.find({
      commodity: { $regex: new RegExp(`^${commodity}$`, "i") },
    });

    if (!mandis.length)
      return res.status(404).json({ message: "No mandis found for this commodity" });

    let ranked;

    if (hasLocation) {
      ranked = mandis.map((m) => {
        const dist          = haversine(lat, lon, m.latitude, m.longitude);
        const transportCost = Math.round(dist * 12);          // ₹12/km estimate
        const profit        = +(m.price - transportCost / 1000).toFixed(2); // per-kg net

        return {
          ...m.toObject(),
          distance:     dist,
          travelTime:   travelTime(dist),
          transportCost,
          profit,
        };
      });

      // Sort: nearest first, then highest profit
      ranked.sort((a, b) => a.distance - b.distance || b.profit - a.profit);

      // Mark as fallback if the closest mandi is more than 500 km away
      const isFallback = ranked[0].distance > 500;
      ranked = ranked.slice(0, 5).map((m, i) => ({
        ...m,
        isFallback: isFallback && i === 0,
        fallbackMessage: isFallback && i === 0
          ? "No nearby mandi found. Showing best available market."
          : undefined,
      }));

      console.log(
        `[Mandi] top result: ${ranked[0]?.name} (${ranked[0]?.distance} km) isFallback=${isFallback}`
      );
    } else {
      // No location — original profit-based sort
      ranked = mandis
        .map((m) => ({
          ...m.toObject(),
          profit: +(m.price - m.transportCost).toFixed(2),
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);

      console.log(`[Mandi] no location — profit sort, top: ${ranked[0]?.name}`);
    }

    res.json(ranked);

    Activity.create({
      activityType: "mandi",
      commodity,
      description:  `Searched best mandi for ${commodity} — top: ${ranked[0]?.name} at ₹${ranked[0]?.price}/kg`,
      metadata:     { topMandi: ranked[0]?.name, topPrice: ranked[0]?.price, count: ranked.length },
    }).catch(() => {});
  } catch (error) {
    console.error("[Mandi] recommendMandis error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllMandis, getMandisByCommodity, recommendMandis };
