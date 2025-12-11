/* --- Config --- */
mapboxgl.accessToken = "pk.eyJ1IjoibHVuaXRhODUiLCJhIjoiY21peGFxamZ2MDJibDNnb2MyemJ4djRsNyJ9.BEU8MHoZgrv_sae1gt3UFw";

// Realistic driving speed in Latacunga (30 km/h)
const SPEED_KMH = 30;
const SPEED_MPM = SPEED_KMH / 60;

/* --- DOM & URL Params --- */
const params = new URLSearchParams(window.location.search);
const fromName = params.get("from");
const toName = params.get("to");
const vehicleId = Number(params.get("vehicle"));
const passenger = params.get("name") || "";
const phone = params.get("phone") || "";

const resultBox = document.querySelector("#quote-result");
const spinner = document.querySelector("#loading-spinner");

let placesCache = null;

// Validate required params
if (!fromName || !toName || !vehicleId) {
  if (resultBox) {
    resultBox.innerHTML =
      `<div class="error-box">Missing trip data. Please go back and complete the form again.</div>`;
  }
  throw new Error("Missing required params");
}

/* --- Load Selected Vehicle --- */
async function loadVehicle() {
  const res = await fetch("data/fleet.json");
  if (!res.ok) throw new Error("fleet.json not found");
  const fleet = await res.json();
  return fleet.find(v => v.id === vehicleId);
}

/* --- Load Local Places (places.json) --- */
async function loadPlaces() {
  if (placesCache) return placesCache;

  try {
    const res = await fetch("data/places.json");
    if (!res.ok) {
      console.warn("places.json not found — using Mapbox only.");
      placesCache = [];
      return placesCache;
    }

    const data = await res.json();
    placesCache = Array.isArray(data) ? data : (data.places || []);
    return placesCache;

  } catch (err) {
    console.error("Error loading places.json", err);
    placesCache = [];
    return placesCache;
  }
}

// Normalize text
function normalize(str) {
  return (str || "").trim().toLowerCase();
}

/* --- Search Place (local first, then Mapbox) --- */
async function searchPlace(placeName) {
  const normalized = normalize(placeName);
  const places = await loadPlaces();

  // Local match
  const localMatch = places.find(p => normalize(p.name) === normalized);
  if (localMatch) {
    const lat = Number(localMatch.lat);
    const lng = Number(localMatch.lon);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return { lat, lng, fullName: localMatch.name };
    }
  }

  // Mapbox search
  const query = `${placeName}, Latacunga, Cotopaxi, Ecuador`;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
    encodeURIComponent(query)
  }.json?country=ec&proximity=-78.615,-0.933&limit=1&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding error for: ${placeName}`);

  const data = await res.json();
  if (!data.features || data.features.length === 0) {
    throw new Error(`Place not found: ${placeName}`);
  }

  const feature = data.features[0];

  return {
    lat: feature.center[1],
    lng: feature.center[0],
    fullName: feature.place_name
  };
}

/* --- Mapbox Directions --- */
async function getRoute(start, end) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Mapbox Directions error");

  const data = await res.json();
  if (!data.routes || data.routes.length === 0) {
    throw new Error("Route not found");
  }

  return data.routes[0];
}

/* --- Quote Result Process --- */
async function loadQuote() {
  try {
    if (spinner) spinner.style.display = "block";

    const vehicle = await loadVehicle();
    if (!vehicle) throw new Error("Selected vehicle not found.");

    const start = await searchPlace(fromName);
    const end = await searchPlace(toName);
    const route = await getRoute(start, end);

    const distanceKm = route.distance / 1000;
    const timeMinutes = distanceKm / SPEED_MPM;
    const totalFare = vehicle.base_fare + distanceKm * vehicle.rate_per_km;

    
    /* --- Save quote to local storage --- */
   
    localStorage.setItem("lastQuote", JSON.stringify({
      from: start.fullName,
      to: end.fullName,
      passenger: passenger,
      phone: phone,
      vehicle: vehicle.model,
      distance: distanceKm.toFixed(2),
      totalFare: totalFare.toFixed(2),
      date: new Date().toLocaleString()
    }));


    // Result render
    resultBox.innerHTML = `
      <h2>${vehicle.model}</h2>
      <img src="${vehicle.image_url}" alt="${vehicle.model}"
           style="width:100%;max-width:500px;border-radius:12px;">

      <table class="quote-table">
        <tbody>
          <tr><th scope="row">From:</th><td>${start.fullName}</td></tr>
          <tr><th scope="row">To:</th><td>${end.fullName}</td></tr>
          <tr><th scope="row">Passenger:</th><td>${passenger}</td></tr>
          <tr><th scope="row">Phone:</th><td>${phone}</td></tr>
          <tr><th scope="row">Distance:</th><td>${distanceKm.toFixed(2)} km</td></tr>
          <tr><th scope="row">Estimated Time:</th><td>${Math.round(timeMinutes)} min</td></tr>
          <tr><th scope="row">Total Estimated Fare:</th><td>$${totalFare.toFixed(2)}</td></tr>
        </tbody>
      </table>
    `;

    // Map
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [start.lng, start.lat],
      zoom: 13
    });

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: route.geometry }
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: { "line-width": 5, "line-color": "#ffb400" }
      });

      new mapboxgl.Marker({ color: "green" })
        .setLngLat([start.lng, start.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Start:</strong> ${start.fullName}`))
        .addTo(map);

      new mapboxgl.Marker({ color: "red" })
        .setLngLat([end.lng, end.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>End:</strong> ${end.fullName}`))
        .addTo(map);
    });

  } catch (err) {
    console.error(err);
    resultBox.innerHTML = `<div class="error-box">Error: ${err.message}</div>`;
  } finally {
    if (spinner) spinner.style.display = "none";
  }
}

loadQuote();
