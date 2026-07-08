const mongoose = require("mongoose");

const mandiSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  district:      { type: String, required: true },
  state:         { type: String, required: true },
  commodity:     { type: String, required: true },
  price:         { type: Number, required: true },
  distance:      { type: Number, required: true },
  transportCost: { type: Number, required: true },
  latitude:      { type: Number, required: true },
  longitude:     { type: Number, required: true },
});

module.exports = mongoose.model("Mandi", mandiSchema);
