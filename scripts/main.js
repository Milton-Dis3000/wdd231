/* --- responsive navigation --- */
const hamButton = document.querySelector('#menu'); 
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
    navigation.classList.toggle('show');
    hamButton.classList.toggle('show');
});

/* --- dynamic footer dates --- */
const yearSpan = document.querySelector('#currentyear'); 
yearSpan.textContent = new Date().getFullYear();

const lastModifiedSpan = document.querySelector('#lastModified');
lastModifiedSpan.textContent = document.lastModified;