const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  day: { type: String, required: true },
  price: { type: Number, required: true },
});

const commoditySchema = new mongoose.Schema({
  commodity: { type: String, required: true, unique: true },
  prices: [priceSchema],
});

module.exports = mongoose.model("Commodity", commoditySchema);
