/* --- Mobile Navigation --- */

const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.classList.toggle("open");
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* --- Footer Info --- */

const yearSpan = document.querySelector("#currentyear");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModifiedSpan = document.querySelector("#lastmodified");
if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;

/* --- Animated Statistics Circles --- */

document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".progress-circle");

  circles.forEach(circle => {
    const percentage = circle.dataset.percentage;
    const progressCircle = circle.querySelector(".progress");
    const valueText = circle.querySelector(".progress-value");

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    let current = 0;
    const duration = 1500;
    const step = duration / percentage;

    const interval = setInterval(() => {
      if (current >= percentage) {
        clearInterval(interval);
      } else {
        current++;
        const offset = circumference - (current / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        valueText.textContent = current + "%";
      }
    }, step);
  });
});


/* --- Modal Functionality  --- */

const rateModal = document.querySelector("#rate-modal");
const openModalBtn = document.querySelector("#open-modal-btn"); 
const closeModalBtn = document.querySelector("#close-modal-btn"); 

if (openModalBtn && rateModal) {
    openModalBtn.addEventListener("click", () => {
        rateModal.showModal();
    });
}

if (closeModalBtn && rateModal) {
    closeModalBtn.addEventListener("click", () => {
        rateModal.close();
    });
}