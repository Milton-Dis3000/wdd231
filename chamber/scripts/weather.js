/* --- global configuration --- */
const weatherDisplay = document.querySelector('#weather-display');
const forecastDisplay = document.querySelector('#forecast-display');

const cityLat = -1.0; 
const cityLon = -78.6; 
const apiKey = 'cc594a74503770cb5ddca26ecd57daa7'; 
const units = 'metric'; 
const unitSymbol = 'C'; 
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=${units}&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=${units}&appid=${apiKey}`;

/* --- helper function --- */
function capitalize(str) {
    if (!str) return str;
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

/* --- display current weather --- */
function displayCurrentWeather(data) {
    if (!weatherDisplay) return;

    const iconCode = data.weather[0].icon;
    const iconsrc = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; 
    let desc = data.weather[0].description;
    
    const capitalizedDesc = capitalize(desc);

    const temp = data.main.temp.toFixed(0);
    const tempHigh = data.main.temp_max.toFixed(0);  
    const tempLow = data.main.temp_min.toFixed(0);   
    const humidity = data.main.humidity;           
    
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('es-EC', { hour: 'numeric', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('es-EC', { hour: 'numeric', minute: '2-digit' });

    weatherDisplay.innerHTML = `
        <p class="description-line"><strong>${capitalizedDesc}</strong></p>
        <div class="weather-details-grid">
            
            <div class="icon-temp-container">
                <img src="${iconsrc}" alt="${capitalizedDesc}" width="80" height="80" loading="lazy">
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

/* --- display 3-day forecast --- */
function displayForecast(data) {
    if (!forecastDisplay) return;
    
    const forecastList = data.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    ).slice(0, 3); 

    forecastDisplay.innerHTML = ''; 

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = dayNames[date.getDay()]; 
        const temp = forecast.main.temp.toFixed(0);
        const iconCode = forecast.weather[0].icon;
        const iconSrc = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day-card'; 
        forecastDay.innerHTML = `
            <p><strong>${day}</strong></p>
            <img src="${iconSrc}" alt="Forecast Icon" width="40" height="40">
            <p><strong>${temp}&deg;${unitSymbol}</strong></p>
        `;
        forecastDisplay.appendChild(forecastDay);
    });
}

/* --- main fetch function --- */
async function fetchWeather() {
    try {
        const responseCurrent = await fetch(currentUrl);
        const dataCurrent = await responseCurrent.json();
        const responseForecast = await fetch(forecastUrl);
        const dataForecast = await responseForecast.json();

        if (responseCurrent.ok && responseForecast.ok) {
            displayCurrentWeather(dataCurrent);
            displayForecast(dataForecast);
        } else {
            console.error("error fetching weather data: one or both apis failed.");
        }

    } catch (error) {
        console.error("connection error while fetching weather data:", error);
    }
}

fetchWeather();