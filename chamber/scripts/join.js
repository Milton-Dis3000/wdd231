/* --- Module: Join Page Logic (Timestamp and Modals) --- */

// 1. Hidden field timestamp logic
const timestampField = document.querySelector('#timestamp');

if (timestampField) {
    const now = new Date();
    timestampField.value = now.toISOString();
}


/* --- Modal Logic Initialization --- */
const modal = document.querySelector('#membership-modal');
const closeModalButton = document.querySelector('#close-modal');
const learnMoreButtons = document.querySelectorAll('.modal-link'); 
const modalTitle = document.querySelector('#modal-title');
const modalContent = document.querySelector('#modal-content');

/* --- Benefits Data Definition --- */
const benefitsData = {
    np: {
        title: "NP Membership",
        cost: "No Fee",
        benefits: ["Basic Directory Listing", "Publications Access", "Training Discounts"]
    },
    bronze: {
        title: "Bronze Membership",
        cost: "$50 / year",
        benefits: ["Enhanced Directory Listing", "Event Discounts (10%)", "Quarterly Newsletter", "Luncheon Access"]
    },
    silver: {
        title: "Silver Membership",
        cost: "$150 / year",
        benefits: ["Premium Directory Listing", "Event Discounts (25%)", "Social Media Spotlight (1x/year)", "Training Access", "Small Banner Ad"]
    },
    gold: {
        title: "Gold Membership",
        cost: "$300 / year",
        benefits: ["Featured Directory Listing", "Event Discounts (50%)", "Priority Sponsorship Access", "Social Media Work (3x/year)", "Full Page Ad in Publication"]
    }
};

/* --- Event Listener for Opening Modal --- */
learnMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const levelKey = button.dataset.level;
        const data = benefitsData[levelKey];

        if (data) {
            modalTitle.textContent = data.title;
            modalContent.innerHTML = `
                <p><strong>Cost:</strong> ${data.cost}</p>
                <h4>Benefits Include:</h4>
                <ul>
                    ${data.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            `;
            modal.showModal();
        }
    });
});

/* --- Event Listener for Closing Modal --- */
closeModalButton.addEventListener('click', () => {
    modal.close();
});