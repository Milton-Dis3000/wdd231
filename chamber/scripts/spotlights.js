const spotlightContainer = document.querySelector('#spotlights-container');
const MAX_SPOTLIGHTS = 3;

async function displaySpotlights() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        const members = data.members;

        // Filter for Gold (3) or Silver (2) members
        const qualifiedMembers = members.filter(m => 
            m.membershipLevel === 3 || m.membershipLevel === 2
        );

        // Randomly select up to MAX_SPOTLIGHTS members without repetition
        const spotlights = [];
        let tempArray = [...qualifiedMembers]; 
        
        while (spotlights.length < MAX_SPOTLIGHTS && tempArray.length > 0) {
            const randomIndex = Math.floor(Math.random() * tempArray.length);
            spotlights.push(tempArray[randomIndex]);
            tempArray.splice(randomIndex, 1); // Remove the selected member
        }
        
        renderSpotlights(spotlights);

    } catch (error) {
        console.error("Error fetching or rendering spotlights:", error);
    }
}

function renderSpotlights(members) {
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'spotlight-card card';
        
        // Determine the level name to display
        const levelName = member.membershipLevel === 3 ? 'Gold' : 'Silver';

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" width="80" height="80">
            <h4>${member.name}</h4>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            <p class="membership-level">Membership: <strong>${levelName}</strong></p>
        `;
        spotlightContainer.appendChild(card);
    });
}

displaySpotlights();    