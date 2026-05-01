/**
 * MINIMAL WEATHER APP
 *
 * Demonstrates:
 * - Fetching from a real API
 * - Error handling with try/catch
 * - Updating DOM with data
 * - Loading/error states
 * - 5-day forecast using /forecast endpoint
 */

// Get DOM elements
const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weather = document.getElementById("weather");
const forecastBtn = document.getElementById("forecastBtn");
const forecast = document.getElementById("forecast");
let isCelsius = true; // Track current unit
let currentTempC = 0;

// API configuration
const API_KEY = CONFIG.API_KEY; 
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Store the last searched city so the forecast button can use it
let currentCity = "";

// Form submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();

  if (!city) return;

  currentCity = city; // save the city name

  // Get existing recent cities or start with empty array
let recent = JSON.parse(localStorage.getItem('recentCities')) || [];

// Add new city to the front
recent.unshift(city);

// Keep only last 5
recent = [...new Set(recent)].slice(0, 5);

// Save back to localStorage
localStorage.setItem('recentCities', JSON.stringify(recent));

  await fetchWeather(city);
  input.value = "";
});

displayRecentSearches();

// Forecast button click handler
forecastBtn.addEventListener("click", async () => {
  if (!currentCity) return;
  await fetchForecast(currentCity);
});

// Fetch current weather
async function fetchWeather(city) {
  loading.classList.remove("hidden");
  error.classList.add("hidden");
  weather.classList.add("hidden");
  forecast.classList.add("hidden");
  forecastBtn.classList.add("hidden"); // hide button on new search

  try {
    const url = `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "City not found"
          : `Error: ${response.status}`,
      );
    }

    const data = await response.json();
    displayWeather(data);

    // Show the forecast button after successful search
    forecastBtn.classList.remove("hidden");
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

// Fetch 5-day forecast
async function fetchForecast(city) {
  loading.classList.remove("hidden");
  forecast.classList.add("hidden");

  try {
    const url = `${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Forecast error: ${response.status}`);
    }

    const data = await response.json();
    displayForecast(data);

    // Change button text to hide forecast if clicked again
    forecastBtn.textContent = "Hide Forecast";
    forecastBtn.onclick = () => {
      forecast.classList.add("hidden");
      forecastBtn.textContent = "Show Forecast";
      forecastBtn.onclick = null; // reset
      forecastBtn.addEventListener("click", async () => {
        await fetchForecast(currentCity);
      });
    };
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

// Display current weather in DOM
function displayWeather(data) {
  document.getElementById("cityName").textContent =
    `${data.name}, ${data.sys.country}`;
  document.getElementById('weatherIcon').src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("temp").textContent =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("description").textContent =
    data.weather[0].description.charAt(0).toUpperCase() +
    data.weather[0].description.slice(1);

  document.getElementById("details").textContent =
    `Feels like ${Math.round(data.main.feels_like)}°C · ` +
    `Humidity ${data.main.humidity}% · ` +
    `Wind ${Math.round(data.wind.speed)} m/s` +
    `Pressure ${data.main.pressure} hPa`;
    currentTempC = data.main.temp; // save it!

    changeBackground(data.weather[0].main);

  weather.classList.remove("hidden");
}

// Display 5-day forecast in DOM
function displayForecast(data) {
  const forecastCards = document.getElementById("forecastCards");
  forecastCards.innerHTML = ""; // clear previous cards

  const dailyData = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const hour = date.getHours();

    if (
      !dailyData[day] ||
      Math.abs(hour - 12) <
        Math.abs(new Date(dailyData[day].dt * 1000).getHours() - 12)
    ) {
      dailyData[day] = item;
    }
  });

  Object.values(dailyData)
    .slice(0, 5)
    .forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const temp = Math.round(item.main.temp);
      const desc =
        item.weather[0].description.charAt(0).toUpperCase() +
        item.weather[0].description.slice(1);

      const card = document.createElement("div");
      card.classList.add("forecast-card");
      card.innerHTML = `
            <div class="day">${day}</div>
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${desc}</div>
        `;

      forecastCards.appendChild(card);
    });

  forecast.classList.remove("hidden");
}

// recent searches function
function displayRecentSearches() {
  const recent = JSON.parse(localStorage.getItem('recentCities')) || [];
  const recentList = document.getElementById('recentList');
  const recentSection = document.getElementById('recentSection');

  if (recent.length === 0) {
    recentSection.classList.add('hidden');
    return;
  }
    recentList.innerHTML = '';

    recent.forEach(city => {
      const btn = document.createElement('button');
      btn.textContent = city;
      btn.classList.add('recent-btn');
      btn.addEventListener('click',  () => {
        fetchWeather(city);
      });
      recentList.appendChild(btn);
    });
  recentSection.classList.remove('hidden');
}

displayRecentSearches();

document.getElementById('toggleUnit').addEventListener('click', () => {
    isCelsius = !isCelsius; // flip between true and false

    const tempEl = document.getElementById('temp');

    if (isCelsius) {
        tempEl.textContent = `${Math.round(currentTempC)}°C`;
        document.getElementById('toggleUnit').textContent = 'Switch to °F';
    } else {
        tempEl.textContent = `${Math.round((currentTempC * 9/5) + 32)}°F`;
        document.getElementById('toggleUnit').textContent = 'Switch to °C';
    }
});

document.getElementById('geoBtn').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        loading.classList.remove('hidden');

        const url = `${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        displayWeather(data);
        currentCity = data.name;
    });
});

function changeBackground(condition) {
    const gradients = {
        Clear: 'linear-gradient(135deg, #f7971e, #ffd200)',
        Clouds: 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
        Rain: 'linear-gradient(135deg, #373b44, #4286f4)',
        Drizzle: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        Thunderstorm: 'linear-gradient(135deg, #200122, #6f0000)',
        Snow: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
        Mist: 'linear-gradient(135deg, #606c88, #3f4c6b)',
    };

    document.body.style.background = 
        gradients[condition] || 'linear-gradient(135deg, #667eea, #764ba2)';
}