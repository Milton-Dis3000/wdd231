/* --- courses --- */
const courses = [
    { courseCode: "CSE PC 110", name: "Introduction to Programming", credits: 2, completed: true },
    { courseCode: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true },
    { courseCode: "CSE 111", name: "Programming with Functions", credits: 2, completed: true },
    { courseCode: "CSE 210", name: "Programming with Classes", credits: 2, completed: true },
    { courseCode: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true },
    { courseCode: "WDD 231", name: "Web Frontend Development I", credits: 2, completed: false }
];

/* --- dom elements --- */
const cardsContainer = document.querySelector('#course-cards');
const totalCreditsSpan = document.querySelector('#total-credits');

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