const { getWeatherByCity } = require("../services/weatherService");
const Activity = require("../models/Activity");

const FALLBACK_WEATHER = {
  city: "Nashik (Fallback)",
  temperature: 28,
  condition: "Clouds",
  description: "scattered clouds",
  humidity: 60,
  windSpeed: 4.5,
  icon: "03d",
  recommendation: "Weather data unavailable. Showing offline sample.",
};

const getWeather = async (req, res) => {
  try {
    const data = await getWeatherByCity(req.params.city);
    res.json(data);
    // Log activity after response
    Activity.create({
      activityType: 'weather',
      description:  `Viewed weather for ${data.city} - ${data.temperature} deg C, ${data.description}`,
      metadata:     { city: data.city, temperature: data.temperature, condition: data.condition, humidity: data.humidity },
    }).catch(() => {})
  } catch (error) {
    console.log("Weather Error:", error.response?.data || error.message);
    
    // Return sample offline data instead of 500
    res.status(200).json({
      ...FALLBACK_WEATHER,
      city: `${req.params.city || "Unknown"} (Offline)`
    });
  }
};

module.exports = { getWeather };