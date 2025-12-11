/* --- Import Weather Module --- */
import { fetchWeather } from './weather.js';

/* --- Featured Premium Fleet Rotation --- */
async function loadFeaturedFleet() {
  const fleetContainer = document.querySelector("#featured-fleet");
  if (!fleetContainer) return;

  try {
    // Fetch fleet data
    const response = await fetch("data/fleet.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const fleetData = await response.json();

    // Fade-in animation
    function fadeIn(element) {
      element.style.opacity = "0";
      element.style.transition = "opacity 0.8s ease-in-out";
      requestAnimationFrame(() => (element.style.opacity = "1"));
    }

    // Render 3 random premium vehicles
    function renderFleet() {
      fleetContainer.innerHTML = "";

      let premium = fleetData.filter(v => v.category === "Premium");
      premium = premium.sort(() => Math.random() - 0.5);
      const selected = premium.slice(0, 3);

      selected.forEach(vehicle => {
        const card = document.createElement("div");
        card.classList.add("fleet-card");

        card.innerHTML = `
          <img src="${vehicle.image_url}" alt="${vehicle.model}">
          <h3>${vehicle.model}</h3>
          <p>Category: <strong>${vehicle.category}</strong></p>
          <p>Capacity: ${vehicle.capacity} passengers</p>
          <p class="price">Base Fare: $${vehicle.base_fare.toFixed(2)}</p>
          <button class="quote-btn" data-vehicle="${vehicle.id}">Get Quote</button>
        `;

        fadeIn(card);
        fleetContainer.appendChild(card);
      });

      // Activate buttons
      document.querySelectorAll(".quote-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          window.location.href = `form.html?vehicle=${btn.dataset.vehicle}`;
        });
      });
    }

    // First load
    renderFleet();

    // Rotate every 10 seconds
    setInterval(renderFleet, 10000);

  } catch (error) {
    console.error("Error loading fleet:", error);
    fleetContainer.innerHTML =
      '<p class="error-message">Could not load featured fleet data.</p>';
  }
}

loadFeaturedFleet();

/* --- Autocomplete for Home Page --- */
let homePlaces = [];

// Load places.json
async function loadHomePlaces() {
  if (homePlaces.length > 0) return homePlaces;

  try {
    const res = await fetch("data/places.json");
    homePlaces = await res.json();
  } catch (e) {
    console.error("Error loading places.json", e);
  }

  return homePlaces;
}

// Enable autocomplete on inputs
function enableAutocompleteHome(selector) {
  const input = document.querySelector(selector);
  if (!input) return;

  const list = document.createElement("div");
  list.className = "autocomplete-list";
  input.parentNode.style.position = "relative";
  input.parentNode.appendChild(list);

  input.addEventListener("input", async () => {
    const query = input.value.trim().toLowerCase();
    list.innerHTML = "";

    if (query.length < 2) return;

    const places = await loadHomePlaces();
    const filtered = places.filter(p => p.name.toLowerCase().includes(query));

    filtered.slice(0, 6).forEach(p => {
      const option = document.createElement("div");
      option.className = "autocomplete-item";
      option.textContent = p.name;

      option.onclick = () => {
        input.value = p.name;
        list.innerHTML = "";
      };

      list.appendChild(option);
    });
  });
}

// Activate autocomplete
document.addEventListener("DOMContentLoaded", () => {
  enableAutocompleteHome("#from");
  enableAutocompleteHome("#to");
  fetchWeather();
});

/* --- Auto-assign Random Premium Vehicle --- */
const premiumVehicles = [4, 5, 6, 7, 11, 15];
const randomPremium = premiumVehicles[Math.floor(Math.random() * premiumVehicles.length)];

const autoVehicleInput = document.querySelector("#autoVehicle");
if (autoVehicleInput) {
  autoVehicleInput.value = randomPremium;
}
