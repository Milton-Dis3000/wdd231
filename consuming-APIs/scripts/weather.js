
/* Select HTML elements */
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');


/* Coordinates and API Key */
const lat = 49.75; 
const lon = 6.64; 
const apiKey = 'cc594a74503770cb5ddca26ecd57daa7'; 

/* API URL Construction */
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;


/* Function to display results on the page */
function displayResults(data) {
  const iconCode = data.weather[0].icon;
  const iconsrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  let desc = data.weather[0].description;
  
  const capitalizedDesc = desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;C`;
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', capitalizedDesc);
  captionDesc.textContent = capitalizedDesc;
}


/* Asynchronous function to fetch data from the API */
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayResults(data); 
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}

apiFetch();