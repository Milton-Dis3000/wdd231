/* --- Load Vehicles for Quote Page --- */

async function loadVehicles() {
  const container = document.querySelector("#vehicle-list");
  if (!container) return;

  try {
    const response = await fetch("data/fleet.json");
    if (!response.ok) throw new Error(`Fleet request failed — status: ${response.status}`);

    const data = await response.json();
    container.innerHTML = "";

    data.forEach(vehicle => {
      const card = document.createElement("article");
      card.classList.add("vehicle-card");

      card.innerHTML = `
        <img src="${vehicle.image_url}" alt="${vehicle.model}" loading="lazy">
        <h3>${vehicle.model}</h3>
        <p>Category: <strong>${vehicle.category}</strong></p>
        <p>Capacity: ${vehicle.capacity} passengers</p>
        <p class="price">Base Fare: $${vehicle.base_fare.toFixed(2)}</p>
        <p>KM Rate: $${vehicle.rate_per_km.toFixed(2)}</p>
        <a href="form.html?vehicle=${vehicle.id}" class="cta-button select-btn">Get Quote</a>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading vehicles:", error);
    container.innerHTML = `<p class="error-message">Unable to load vehicles.</p>`;
  }
}

loadVehicles();
