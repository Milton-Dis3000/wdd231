/* --- Selectors --- */
const container = document.querySelector("#member-cards");
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

/* --- Fetch and Load Data --- */
async function loadMembers() {
    const response = await fetch("data/members.json");
    const data = await response.json();
    displayMembers(data.members);
}

/* --- Display Members in DOM --- */
function displayMembers(members) {
    container.innerHTML = "";
    members.forEach(member => {
        const card = document.createElement("section");
        
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
        `;
        container.appendChild(card);
    });
}

/* --- View Switching Logic --- */
function switchView(targetView) {
    if (targetView === 'grid') {
        container.classList.add("grid");
        container.classList.remove("list");
        gridButton.classList.add("active");
        listButton.classList.remove("active");
    } else {
        container.classList.add("list");
        container.classList.remove("grid");
        listButton.classList.add("active");
        gridButton.classList.remove("active");
    }

    // Accessibility (ARIA) attribute update
    gridButton.setAttribute("aria-pressed", targetView === 'grid' ? "true" : "false");
    listButton.setAttribute("aria-pressed", targetView === 'list' ? "true" : "false");
}

/* --- Event Listeners --- */
gridButton.addEventListener("click", () => {
    switchView('grid');
});

listButton.addEventListener("click", () => {
    switchView('list');
});

/* --- Initialize --- */
loadMembers();