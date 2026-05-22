// routes/weather-api.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/clima/json', async (req, res) => {
  try {
    const city = req.query.city || 'Barcelona';
    const resp = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, units: 'metric', lang: 'es', appid: process.env.OPENWEATHER_API_KEY }
    });
    const d = resp.data;
    const clima = {
      city: d.name,
      temp: Math.round(d.main.temp * 10) / 10,
      feels_like: Math.round(d.main.feels_like * 10) / 10,
      humidity: d.main.humidity,
      description: d.weather?.[0]?.description,
      icon: d.weather?.[0]?.icon,
      wind_speed: d.wind?.speed,
      clouds: d.clouds?.all
    };
    res.json({ ok: true, clima });
  } catch (err) {
    res.status(err.response?.status || 500).json({ ok: false, error: err.response?.data || err.message });
  }
});

module.exports = router;
