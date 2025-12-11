/* --- Select weather display container --- */
const weatherDisplay = document.querySelector("#weather-display");

/* --- API configuration --- */
const cityLat = -1.0;
const cityLon = -78.6;
const apiKey = "cc594a74503770cb5ddca26ecd57daa7";
const units = "metric";
const unitSymbol = "C";

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=${units}&appid=${apiKey}`;

/* --- Capitalize weather description --- */
function capitalize(str) {
  if (!str) return str;

  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/* --- Render current weather UI --- */
function displayCurrentWeather(data) {
  if (!weatherDisplay) return;

  // Weather icon + text
  const iconCode = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  const description = capitalize(data.weather[0].description);

  // Temperature data
  const temp = data.main.temp.toFixed(0);
  const tempHigh = data.main.temp_max.toFixed(0);
  const tempLow = data.main.temp_min.toFixed(0);
  const humidity = data.main.humidity;

  // Sunrise & sunset times
  const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
    "en-EC",
    { hour: "numeric", minute: "2-digit" }
  );

  const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString(
    "en-EC",
    { hour: "numeric", minute: "2-digit" }
  );

  // Render HTML
  weatherDisplay.innerHTML = `
    <p class="description-line"><strong>${description}</strong></p>

    <div class="weather-details-grid">
      <div class="icon-temp-container">
        <img src="${iconSrc}" alt="${description}" width="80" height="80" loading="lazy">
        <span class="current-temp-value">${temp}&deg;${unitSymbol}</span>
      </div>

      <div class="details-list">
        <p>High: <strong>${tempHigh}&deg;${unitSymbol}</strong></p>
        <p>Low: <strong>${tempLow}&deg;${unitSymbol}</strong></p>
        <p>Humidity: <strong>${humidity}%</strong></p>
        <p>Sunrise: <strong>${sunriseTime}</strong></p>
        <p>Sunset: <strong>${sunsetTime}</strong></p>
      </div>
    </div>
  `;
}

/* --- Fetch weather from API --- */
export async function fetchWeather() {
  if (!weatherDisplay) return;

  try {
    const responseCurrent = await fetch(currentUrl);

    if (!responseCurrent.ok) {
      throw new Error(`Weather request failed — status: ${responseCurrent.status}`);
    }

    const dataCurrent = await responseCurrent.json();
    displayCurrentWeather(dataCurrent);

  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherDisplay.innerHTML =
      "<p>Weather information is currently unavailable.</p>";
  }
}
