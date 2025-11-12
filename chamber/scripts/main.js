/* --- footer: year and last modified date --- */
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastmodified").textContent = document.lastModified;

/* --- navigation: responsive menu toggle --- */
const navButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

navButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    navButton.classList.toggle("open");
});