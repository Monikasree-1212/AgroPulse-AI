const { getWeatherByCity } = require("../services/weatherService");
const Activity = require("../models/Activity");

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
    console.log("Weather Error:");
    console.log(error.response?.data || error.message);
    res.status(500).json({
      message: "Weather service unavailable",
      error: error.response?.data || error.message
    });
  }
};

module.exports = { getWeather };