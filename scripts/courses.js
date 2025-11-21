/* --- courses --- */
const courses = [
    { courseCode: "CSE PC 110", name: "Introduction to Programming", credits: 2, completed: true, description: "Introduces fundamental programming concepts and practices using JavaScript/Python.", technology: ["JavaScript", "Python", "VS Code"] },
    { courseCode: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true, description: "Covers the foundations of web development, including basic HTML structure and CSS styling.", technology: ["HTML5", "CSS3", "Git"] },
    { courseCode: "CSE 111", name: "Programming with Functions", credits: 2, completed: true, description: "Focuses on writing clean, modular code using functions, data structures, and conditional logic.", technology: ["JavaScript", "Functions", "Testing"] },
    { courseCode: "CSE 210", name: "Programming with Classes", credits: 2, completed: true, description: "Explores object-oriented programming (OOP) principles, inheritance, and polymorphism.", technology: ["C#", "OOP", "Debugging"] },
    { courseCode: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true, description: "Teaches fundamental concepts of DOM manipulation and event handling using JavaScript.", technology: ["JavaScript", "DOM", "Events", "Forms"] },
    { courseCode: "WDD 231", name: "Web Frontend Development I", credits: 2, completed: false, description: "Advanced frontend development focusing on APIs, complex data fetching, and contemporary design patterns.", technology: ["JavaScript", "Fetch API", "Modals", "JSON"] }
];

/* --- dom elements --- */
const cardsContainer = document.querySelector('#course-cards');
const totalCreditsSpan = document.querySelector('#total-credits');
const courseDetails = document.querySelector('#course-details'); 

/* --- modal function --- */
function displayCourseDetails(course) {
    courseDetails.innerHTML = `
        <button id="closeModal">❌ Close</button>
        <h3>${course.courseCode} - ${course.name}</h3>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>Status:</strong> ${course.completed ? 'Completed ✅' : 'In Progress ⏳'}</p>
        <p>${course.description}</p>
        <p><strong>Technologies:</strong> ${course.technology.join(', ')}</p>
    `;

    courseDetails.showModal();

    document.querySelector('#closeModal').addEventListener("click", () => {
        courseDetails.close();
    });
}


/* --- render cards --- */
function renderCourseCards(courseList) {
    cardsContainer.innerHTML = '';
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsSpan.textContent = totalCredits;

    courseList.forEach(course => {
        const card = document.createElement('div');
        const completionClass = course.completed ? 'completed' : 'incomplete';
        card.classList.add('course-card', completionClass);
        
        let checkmark = '';
        if (course.completed) {
            checkmark = '✅';
        } else if (course.courseCode === "WDD 231") {
            checkmark = '⏳';
        }

        card.innerHTML = `
            <h3>${checkmark} ${course.courseCode}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
        `;
        
        // EVENT LISTENER PARA ABRIR MODAL
        card.addEventListener('click', () => {
            displayCourseDetails(course);
        });
        
        card.style.cursor = 'pointer'; 

        cardsContainer.appendChild(card);
    });
}

/* --- filter courses --- */
const filterCourses = (discipline) => {
    if (discipline === 'All') {
        renderCourseCards(courses);
        return;
    }
    const filteredList = courses.filter(course => 
        course.courseCode.toUpperCase().includes(discipline.toUpperCase())
    );
    renderCourseCards(filteredList);
};

/* --- events --- */
document.querySelector('#btn-all').addEventListener('click', () => filterCourses('All'));
document.querySelector('#btn-cse').addEventListener('click', () => filterCourses('CSE'));
document.querySelector('#btn-wdd').addEventListener('click', () => filterCourses('WDD'));

/* --- initial render --- */
renderCourseCards(courses);