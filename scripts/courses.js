/* --- courses --- */
const courses = [
    { 
        courseCode: "CSE 110", 
        name: "Introduction to Programming", 
        credits: 2, 
        completed: true, 
        description: "Focuses on fundamental programming concepts, using Python, and the basics of algorithm design and problem-solving.", 
        technology: ["Python", "Algorithms", "Conditionals"] 
    },
    { 
        courseCode: "WDD 130", 
        name: "Web Fundamentals", 
        credits: 2, 
        completed: true, 
        description: "Covers the foundations of building web pages using semantic HTML, basic CSS styling, and introduces version control with Git.", 
        technology: ["HTML5", "CSS3", "Git"] 
    },
    { 
        courseCode: "CSE 111", 
        name: "Programming with Functions", 
        credits: 2, 
        completed: true, 
        description: "Teaches how to write organized and reusable code by focusing on functions, data structures, and debugging techniques.", 
        technology: ["Python", "Functions", "Data Structures"] 
    },
    { 
        courseCode: "WDD 131", 
        name: "Dynamic Web Fundamentals", 
        credits: 2, 
        completed: true, 
        description: "Introduces core JavaScript for creating interactive web experiences, focusing on DOM manipulation, event handling, and forms.", 
        technology: ["JavaScript", "DOM", "Events", "Forms"] 
    },
    { 
        courseCode: "CSE 210", 
        name: "Programming with Classes", 
        credits: 2, 
        completed: true, 
        description: "Explores Object-Oriented Programming (OOP) principles, including inheritance, polymorphism, and class design using C#.", 
        technology: ["C#", "OOP", "Encapsulation"] 
    },
    { 
        courseCode: "WDD 231", 
        name: "Web Frontend Development I", 
        credits: 2, 
        completed: false, 
        description: "Advanced frontend topics including consuming external APIs, data fetching, modern JavaScript features (e.g., Modals, JSON), and responsive layouts.", 
        technology: ["JavaScript", "Fetch API", "Modals", "JSON", "Responsive Design"] 
    },
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