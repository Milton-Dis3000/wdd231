/* --- NAVIGATION TOGGLE LOGIC --- */
const navButton = document.querySelector('#nav-button');
const navBar = document.querySelector('#nav-bar'); 

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show'); 
  navBar.classList.toggle('show'); 
});

/* --- DYNAMIC FOOTER DATES --- */
const yearSpan = document.querySelector('#year');
yearSpan.textContent = new Date().getFullYear();

// Set last modified date
const lastModifiedSpan = document.querySelector('#lastModified');
lastModifiedSpan.textContent = document.lastModified;