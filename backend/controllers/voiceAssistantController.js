const axios = require("axios");
const Commodity        = require("../models/Commodity");
const Mandi            = require("../models/Mandi");
const GovernmentScheme = require("../models/GovernmentScheme");
const Activity         = require("../models/Activity");
const { getWeatherByCity } = require("../services/weatherService");

const COMMODITIES = ["onion", "potato", "pulses", "maize", "coconut"];

function detectCommodity(text) {
  const t = text.toLowerCase();
  return COMMODITIES.find((c) => t.includes(c)) || null;
}

function detectCity(text) {
  const cities = ["delhi", "mumbai", "chennai", "kolkata", "bangalore", "hyderabad",
                  "pune", "ahmedabad", "jaipur", "lucknow", "nashik", "nagpur"];
  const t = text.toLowerCase();
  return cities.find((c) => t.includes(c)) || "Delhi";
}

function detectDay(text) {
  const t = text.toLowerCase();
  const map = { one: 1, two: 2, three: 3, four: 4, five: 5,
                six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  for (const [word, num] of Object.entries(map)) {
    if (t.includes(word)) return num;
  }
  const match = t.match(/\b(\d+)\b/);
  return match ? parseInt(match[1]) : 7;
}

const handleQuery = async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || !text.trim())
    return res.status(400).json({ message: "Query text is required." });

  const t = text.toLowerCase();

  // Log every voice query
  Activity.create({
    activityType: 'voice',
    description:  `Voice Assistant: "${text.substring(0, 100)}"`,
    metadata:     { query: text },
  }).catch(() => {})

  try {
    /* -- Price query -- */
    if ((t.includes("price") || t.includes("rate") || t.includes("cost")) &&
        !t.includes("predict") && !t.includes("forecast") && !t.includes("future")) {
      const commodity = detectCommodity(t);
      if (!commodity)
        return res.json({ type: "price", reply: "Please mention a commodity like Onion, Potato, Pulses, Maize, or Coconut." });

      const doc = await Commodity.findOne({ commodity: { $regex: new RegExp(`^${commodity}$`, "i") } });
      if (!doc)
        return res.json({ type: "price", reply: `Sorry, I could not find price data for ${commodity}.` });

      const latest = doc.prices[doc.prices.length - 1];
      const name   = doc.commodity;
      return res.json({
        type: "price",
        reply: `Today's ${name} price is Rs.${latest.price} per kilogram on ${latest.day}.`,
      });
    }

    /* -- Prediction query -- */
    if (t.includes("predict") || t.includes("forecast") || t.includes("future") || t.includes("after")) {
      const commodity = detectCommodity(t);
      if (!commodity)
        return res.json({ type: "prediction", reply: "Please mention a commodity like Onion, Potato, Pulses, Maize, or Coconut." });

      const day = detectDay(t);
      try {
        const { data } = await axios.get(`http://localhost:8000/predict/${commodity}/${day}`);
        return res.json({
          type: "prediction",
          reply: `Expected ${commodity} price after ${day} days is Rs.${data.predictedPrice} per kilogram with ${data.confidence}% confidence.`,
        });
      } catch {
        return res.json({ type: "prediction", reply: "Prediction service is currently unavailable. Please ensure the ML server is running." });
      }
    }

    /* -- Weather query -- */
    if (t.includes("weather") || t.includes("temperature") || t.includes("rain") ||
        t.includes("humidity") || t.includes("wind") || t.includes("climate")) {
      const city = detectCity(t);
      try {
        const weather = await getWeatherByCity(city);
        return res.json({
          type: "weather",
          reply: `Today's weather in ${weather.city} is ${weather.temperature} deg rees Celsius with ${weather.description}. Humidity is ${weather.humidity}% and wind speed is ${weather.windSpeed} kilometres per hour.`,
        });
      } catch {
        return res.json({ type: "weather", reply: "Weather service is currently unavailable. Please check your API key." });
      }
    }

    /* -- Mandi query -- */
    if (t.includes("mandi") || t.includes("market") || t.includes("sell") || t.includes("best place")) {
      const commodity = detectCommodity(t);
      const searchCommodity = commodity || "onion";

      const mandis = await Mandi.find({ commodity: { $regex: new RegExp(`^${searchCommodity}$`, "i") } });
      if (!mandis.length)
        return res.json({ type: "mandi", reply: `No mandi data found for ${searchCommodity}.` });

      const best = mandis
        .map((m) => ({ ...m.toObject(), profit: m.price - m.transportCost }))
        .sort((a, b) => b.profit - a.profit)[0];

      return res.json({
        type: "mandi",
        reply: `For ${best.commodity}, ${best.name} in ${best.district}, ${best.state} gives the highest expected profit of Rs.${best.profit} per kilogram at a market price of Rs.${best.price}.`,
      });
    }

    /* -- Government schemes query -- */
    if (t.includes("scheme") || t.includes("government") || t.includes("subsidy") ||
        t.includes("pm kisan") || t.includes("insurance") || t.includes("loan") ||
        t.includes("kcc") || t.includes("msp") || t.includes("support price")) {

      if (t.includes("msp") || t.includes("support price") || t.includes("minimum")) {
        return res.json({
          type: "government",
          reply: "Current MSP rates: Wheat Rs.2425, Paddy Rs.2369, Maize Rs.2090, Cotton Rs.7710, Tur Rs.7550, Moong Rs.8682 per quintal. Onion and Potato are market driven.",
        });
      }

      const schemes = await GovernmentScheme.find().limit(3).sort({ createdAt: -1 });
      if (!schemes.length)
        return res.json({ type: "government", reply: "No government scheme data found. Please seed the database." });

      const names = schemes.map((s) => s.title).join(", ");
      return res.json({
        type: "government",
        reply: `Top government schemes for farmers include: ${names}. Visit the Government Schemes section on the dashboard for full details and official links.`,
      });
    }

    /* -- Profit query -- */
    if (t.includes("profit") || t.includes("earn") || t.includes("income") || t.includes("revenue")) {
      const commodity = detectCommodity(t) || "onion";
      const doc = await Commodity.findOne({ commodity: { $regex: new RegExp(`^${commodity}$`, "i") } });
      const currentPrice = doc ? doc.prices[doc.prices.length - 1].price : 0;

      try {
        const { data } = await axios.get(`http://localhost:8000/predict/${commodity}/7`);
        const diff = (data.predictedPrice - currentPrice).toFixed(2);
        const action = diff > 0 ? "hold your stock" : "sell today";
        return res.json({
          type: "profit",
          reply: `For ${commodity}, current price is Rs.${currentPrice} and predicted price after 7 days is Rs.${data.predictedPrice}. I recommend you ${action} for maximum profit. Use the Profit Simulator for detailed calculations.`,
        });
      } catch {
        return res.json({ type: "profit", reply: "Use the Profit Simulator on the dashboard to calculate your expected earnings." });
      }
    }

    /* -- Help / fallback -- */
    return res.json({
      type: "help",
      reply: "I can help you with: crop prices, price predictions, weather updates, best mandi recommendations, government schemes, and profit calculations. Try asking: What is today's onion price? or What is the weather in Delhi?",
    });

  } catch (error) {
    res.status(500).json({ message: "Voice assistant encountered an error.", error: error.message });
  }
};

module.exports = { handleQuery };
