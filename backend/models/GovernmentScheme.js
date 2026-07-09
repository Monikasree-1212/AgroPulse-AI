const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  category:     { type: String, required: true },
  state:        { type: String, default: "All India" },
  eligibility:  { type: String, required: true },
  benefits:     { type: String, required: true },
  website: { type: String, required: true },
  image:        { type: String, default: "" },
  createdAt:    { type: Date,   default: Date.now },
});

module.exports = mongoose.model("GovernmentScheme", governmentSchemeSchema);
