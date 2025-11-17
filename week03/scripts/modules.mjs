// modules.mjs

/* Import Core Data (Default Export) */
import byuiCourse from './course.mjs'; 
/* Import Section Setup Function (Named Export) */
import { setSectionSelection } from './sections.mjs';
/* Import UI Rendering Functions (Named Exports) */
import { setTitle, renderSections } from "./output.mjs";

/* Initialize UI */
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

/* Event Listener: Enroll */
document.querySelector("#enrollStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum);
  // /* Update View after Change */
  renderSections(byuiCourse.sections); 
});

/* Event Listener: Drop */
document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum, false);
  // /* Update View after Change */
  renderSections(byuiCourse.sections); 
});