const Commodity = require("../models/Commodity");
const Activity  = require("../models/Activity");

const getCommodityPrices = async (req, res) => {
  try {
    const commodity = await Commodity.findOne({
      commodity: { $regex: new RegExp(`^${req.params.name}$`, "i") },
    });
    if (!commodity) return res.status(404).json({ message: "Commodity not found" });
    res.json(commodity);
    // Log activity after response
    const latest = commodity.prices?.[commodity.prices.length - 1]
    Activity.create({
      activityType: 'price',
      commodity:    commodity.commodity,
      description:  `Checked ${commodity.commodity} price — ₹${latest?.price ?? '?'}/kg on ${latest?.day ?? '?'}`,
      metadata:     { price: latest?.price, day: latest?.day },
    }).catch(() => {})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommodityPrices };
