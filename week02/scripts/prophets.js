/* Variable declaration required by the activity */ 
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

/* Main async function to fetch data using the Fetch API */
const getProphetData = async () => {
    try {
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json(); 
            displayProphets(data.prophets); 
        } else {
             throw Error(await response.text());
        }
    } catch (error) {
        console.error('Error fetching prophet data:', error);
    }
}

/* Function to build and display the prophet cards */
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // DOM element creation
        let card = document.createElement('section');
        let fullName = document.createElement('h2'); 
        let birthDate = document.createElement('p'); 
        let birthPlace = document.createElement('p'); 
        let portrait = document.createElement('img');

        // Populate content
        fullName.textContent = `${prophet.name} ${prophet.lastname}`; 
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        // Configure image attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`); 
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        // Build the card structure (DOM manipulation)
        card.appendChild(fullName); 
        card.appendChild(birthDate); 
        card.appendChild(birthPlace);
        card.appendChild(portrait);

        // Append the card to the main container
        cards.appendChild(card);
    }); 
}

/* Initiate data loading process */
getProphetData();