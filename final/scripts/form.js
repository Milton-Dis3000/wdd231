/* --- Load Selected Vehicle --- */

const params = new URLSearchParams(window.location.search);
const vehicleId = Number(params.get("vehicle"));
const vehicleBox = document.querySelector("#selected-vehicle");
const hiddenVehicle = document.querySelector("#vehicle");

async function loadVehicle() {
  const res = await fetch("data/fleet.json");
  const fleet = await res.json();
  const v = fleet.find(x => x.id === vehicleId);

  hiddenVehicle.value = vehicleId;

  vehicleBox.innerHTML = `
    <img src="${v.image_url}">
    <h3>${v.model}</h3>
    <p><strong>Category:</strong> ${v.category}</p>
    <p><strong>Capacity:</strong> ${v.capacity}</p>
    <p><strong>Base Fare:</strong> $${v.base_fare}</p>
    <p><strong>Rate per KM:</strong> $${v.rate_per_km}</p>
  `;
}

loadVehicle();

/* --- Local Autocomplete --- */

let places = [];

async function loadPlaces() {
  const res = await fetch("data/places.json");
  places = await res.json();
}

loadPlaces();

function enableLocalAutocomplete(inputId) {
  const input = document.querySelector(inputId);
  const list = document.createElement("div");

  list.className = "autocomplete-list";
  input.parentNode.appendChild(list);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    list.innerHTML = "";

    if (q.length < 2) return;

    places
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 6)
      .forEach(p => {
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

enableLocalAutocomplete("#from");
enableLocalAutocomplete("#to");

/* --- Form Validation --- */

const form = document.querySelector("#quote-form");

form.addEventListener("submit", e => {
  const from = document.querySelector("#from").value.trim();
  const to = document.querySelector("#to").value.trim();

  if (!places.some(p => p.name === from)) {
    e.preventDefault();
    alert("Select a valid origin from the list.");
  }

  if (!places.some(p => p.name === to)) {
    e.preventDefault();
    alert("Select a valid destination from the list.");
  }
});
