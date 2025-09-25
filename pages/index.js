import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { sdk } from '@farcaster/miniapp-sdk'
import React, { useState } from 'react';

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

async function getLatLon(city) {
  const res = await fetch(`${GEOCODE_API_URL}?name=${encodeURIComponent(city)}&count=1`);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name,
    };
  }
  throw new Error("City not found");
}

// Add a mapping for weather_code to description
const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    hourly: "uv_index",
    current: ["temperature_2m", "relative_humidity_2m", "precipitation", "weather_code", "cloud_cover", "wind_speed_10m"].join(","),
    forecast_days: 1,
    wind_speed_unit: "mph",
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
  });
  const res = await fetch(`${WEATHER_API_URL}?${params}`);
  const data = await res.json();
  if (!data.current) throw new Error("Weather data not found");
  const code = data.current.weather_code;
  return {
    temp: `${data.current.temperature_2m} °F`,
    wind: `${data.current.wind_speed_10m} mph`,
    humidity: `${data.current.relative_humidity_2m} %`,
    sky: weatherCodeMap[code] || "Unknown",
    city: data.latitude && data.longitude ? `Lat: ${data.latitude}, Lon: ${data.longitude}` : "",
  };
}

export default function Home() {

  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const handleGetWeather = async () => {
    setError('');
    setWeather(null);
    // Only allow letters, spaces, and hyphens. Basic security
    if (!/^[a-zA-Z\s\-]+$/.test(city)) {
      setError('Invalid city name.');
      return;
    }
    try {
      const loc = await getLatLon(city);
      const weatherData = await getWeather(loc.latitude, loc.longitude);
      setWeather({
        city: loc.name,
        temp: weatherData.temp,
        wind: weatherData.wind,
        humidity: weatherData.humidity,
        sky: weatherData.sky,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  sdk.actions.ready();
  return (
    <div className="container-fluid">
      <main>
        <Header title="Leo's Simple Weather" />
        <section className="inputs">
          <input
            type="text"
            id="cityInput"
            placeholder="Enter city name"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleGetWeather();
              }
            }}
          />
          <button id="getWeatherBtn" onClick={handleGetWeather}>
            Get Weather
          </button>
          {error && <div style={{color: 'red'}}>{error}</div>}
        </section>
        <section className="display">
          <div className="wrapper">
            <h2 id="cityOutput">{weather?.city}</h2>
            <p id="sky">Sky: {weather?.sky}</p>
            <p id="temp">Temperature: {weather?.temp}</p>
            <p id="humidity">Humidity: {weather?.humidity}</p>
            <p id="wind">Wind: {weather?.wind}</p>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
