const axios = require("axios");

const API_KEY = process.env.WEATHER_API_KEY;
const BASE    = "https://api.openweathermap.org/data/2.5";

const getWeatherByCity = async (city) => {
  const [current, forecast] = await Promise.all([
    axios.get(`${BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`),
    axios.get(`${BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=7`),
  ]);

  const c = current.data;
  const forecastList = forecast.data.list.map((item) => ({
    day: new Date(item.dt * 1000).toLocaleDateString("en-IN", { weekday: "short" }),
    temperature: Math.round(item.main.temp),
    condition: item.weather[0].main,
    humidity: item.main.humidity,
    rainfall: item.rain ? Math.round(item.rain["3h"] || 0) : 0,
  }));

  return {
    city: c.name,
    temperature: Math.round(c.main.temp),
    humidity: c.main.humidity,
    rainfall: c.rain ? Math.round(c.rain["1h"] || 0) : 0,
    windSpeed: Math.round(c.wind.speed * 3.6),
    condition: c.weather[0].main,
    description: c.weather[0].description,
    forecast: forecastList,
  };
};

module.exports = { getWeatherByCity };
