/* --- Handle last visit message --- */
function setLastVisitMessage() {
    const messageElement = document.getElementById('visit-message');
    const today = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');

    if (!lastVisit) {
        messageElement.textContent = "Welcome! This is your first visit to the Discover page.";
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const diffTime = today - lastVisitDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            messageElement.textContent = "You returned today! Thanks for your interest in Latacunga.";
        } else if (diffDays === 1) {
            messageElement.textContent = "Your last visit was 1 day ago. We hope you find something new!";
        } else {
            messageElement.textContent = `Your last visit was ${diffDays} days ago. There is much to explore!`;
        }
    }

    localStorage.setItem('lastVisit', today.toString());
}

/* --- Fetch JSON data and build cards --- */
async function getPlacesData() {
    const url = 'data/places.json'; 
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayPlaces(data.places);
        } else {
            throw Error(`Failed to load data: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching place data:', error);
        document.getElementById('place-cards').innerHTML = '<p class="error-load">Error loading place data.</p>';
    }
}

/* --- Render the place cards --- */
function displayPlaces(places) {
    const cardsContainer = document.getElementById('place-cards');
    
    const featuredPlaces = places.slice(0, 8);

    featuredPlaces.forEach(place => {
        const card = document.createElement('section');
        card.classList.add('discover-card');
        card.setAttribute('aria-label', `Information card for ${place.name}`);

        card.innerHTML = `
            <div class="image-area">
                <img src="images/${place.photo_link}" 
                    alt="${place.name}" 
                    loading="lazy"
                    class="place-image">
            </div>
            <div class="name-area">
                <h3>${place.name}</h3>
            </div>
            <div class="description-area">
                <p>${place.description}</p>
            </div>
            <div class="location-area">
                <p class="address-text">${place.address}</p>
            </div>
            <div class="button-area">
                <a href="${place.link}" class="learn-more-button" target="_blank" rel="noopener noreferrer">Learn More</a>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
    
    // Lazy Loading uses the native attribute set in the HTML
    applyLazyLoading(); 
}

/* --- Lazy Loading implementation --- */
function applyLazyLoading() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((items, observer) => {
            items.forEach(item => {
                if (item.isIntersecting) {
                    const image = item.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                    }
                    observer.unobserve(image); 
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.place-image').forEach(img => {
            if (img.getAttribute('loading') === 'lazy') {
                observer.observe(img);
            }
        });
    }
}

/* --- Run on page load --- */
document.addEventListener('DOMContentLoaded', () => {
    setLastVisitMessage();
    getPlacesData();
});