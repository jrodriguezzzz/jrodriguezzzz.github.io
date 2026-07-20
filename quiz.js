// quiz.js

// ---- Mobile hamburger nav toggle (Milestone 3) ----
// Works on every page: clicking the hamburger button shows/hides the nav
// links on narrow screens by toggling a CSS class.
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("nav-open");
    });
}

// ---- Click-to-expand image lightbox (Milestone 3) ----
// Any image with the "zoomable" class opens larger in an overlay when clicked.
const zoomableImages = document.getElementsByClassName("zoomable");

if (zoomableImages.length > 0) {
    // Build the overlay elements once and add them to the page, starting hidden.
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";
    const overlayImg = document.createElement("img");
    overlay.appendChild(overlayImg);
    document.body.appendChild(overlay);

    // Clicking any zoomable image copies its source into the overlay and shows it.
    for (let i = 0; i < zoomableImages.length; i++) {
        zoomableImages[i].addEventListener("click", function () {
            overlayImg.src = zoomableImages[i].src;
            overlayImg.alt = zoomableImages[i].alt;
            overlay.classList.add("overlay-open");
        });
    }

    // Clicking anywhere on the overlay closes it again.
    overlay.addEventListener("click", function () {
        overlay.classList.remove("overlay-open");
    });
}

// Handles grading the HTTP self-assessment quiz.
// Each question is worth 20 points, for a total of 100 points.
// A score of 60 or higher counts as a pass.

// The correct answers for each question live here so they are easy to find and update.
const correctAnswers = {
    q1: "get",                                   // fill in the blank (checked without case sensitivity)
    q2: "1.1",                                    // single correct radio choice
    q3: "UDP",                                    // single correct radio choice
    q4: "1991",                                   // single correct radio choice
    q5: ["multiplexing", "compression", "push"]   // multiple correct checkboxes
};

const pointsPerQuestion = 20;

// Grab the form and results box once, so it doesn't have to look them up every time.
const quizForm = document.getElementById("quiz-form");
const resultsBox = document.getElementById("results-box");
const resetBtn = document.getElementById("reset-btn");

if (quizForm) {

// Run this function whenever the quiz is submitted.
quizForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    let totalScore = 0;

    // ---- Question 1: fill in the blank ----
    const q1Answer = document.getElementById("q1").value.trim().toLowerCase();
    const q1Correct = q1Answer === correctAnswers.q1;
    totalScore += gradeQuestion("q1", q1Correct, "GET");

    // ---- Question 2, 3, 4: multiple choice (radio buttons) ----
    totalScore += gradeRadioQuestion("q2", correctAnswers.q2);
    totalScore += gradeRadioQuestion("q3", correctAnswers.q3);
    totalScore += gradeRadioQuestion("q4", correctAnswers.q4);

    // ---- Question 5: multi-select (checkboxes) ----
    totalScore += gradeCheckboxQuestion("q5", correctAnswers.q5);

    // Show the pass/fail banner and final score at the top of the results box.
    showOverallResult(totalScore);
});

// Grades a plain text/fill-in-the-blank question and displays feedback.
// Returns the points earned (0 or full points).
function gradeQuestion(questionId, isCorrect, correctAnswerText) {
    const feedback = document.getElementById(questionId + "-feedback");
    if (isCorrect) {
        feedback.textContent = "Correct! (+" + pointsPerQuestion + " points)";
        feedback.className = "feedback correct";
        return pointsPerQuestion;
    } else {
        feedback.textContent = "Incorrect. The correct answer is: " + correctAnswerText;
        feedback.className = "feedback incorrect";
        return 0;
    }
}

// Grades a radio-button (single correct answer) question.
function gradeRadioQuestion(questionName, correctValue) {
    const options = document.getElementsByName(questionName);
    let selectedValue = null;

    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selectedValue = options[i].value;
        }
    }

    const isCorrect = selectedValue === correctValue;
    return gradeQuestion(questionName, isCorrect, correctValue);
}

// Grades a checkbox (multiple correct answers) question.
// Full credit is only given if the user picked exactly the right set of boxes.
function gradeCheckboxQuestion(questionName, correctValues) {
    const options = document.getElementsByName(questionName);
    const selectedValues = [];

    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selectedValues.push(options[i].value);
        }
    }

    // Sort both arrays so it can compare them fairly regardless of click order.
    const selectedSorted = selectedValues.slice().sort();
    const correctSorted = correctValues.slice().sort();
    const isCorrect = JSON.stringify(selectedSorted) === JSON.stringify(correctSorted);

    const correctText = "Stream multiplexing, Header compression, Server push";
    return gradeQuestion(questionName, isCorrect, correctText);
}

// Builds and displays the overall pass/fail banner with the final score.
function showOverallResult(totalScore) {
    const maxScore = pointsPerQuestion * 5;
    const passed = totalScore >= 60;

    resultsBox.innerHTML = "";
    resultsBox.style.display = "block";

    const heading = document.createElement("h3");
    heading.textContent = passed ? "Result: PASS" : "Result: FAIL";
    heading.className = passed ? "result-pass" : "result-fail";

    const scoreLine = document.createElement("p");
    scoreLine.textContent = "Your score: " + totalScore + " / " + maxScore;
    scoreLine.className = passed ? "result-pass" : "result-fail";

    resultsBox.appendChild(heading);
    resultsBox.appendChild(scoreLine);

    // Scroll the results into view so the user notices them right away.
    resultsBox.scrollIntoView({ behavior: "smooth" });
}

// Resets the quiz: clears all inputs, per-question feedback, and the results box.
resetBtn.addEventListener("click", function () {
    quizForm.reset(); // clears text input, radio buttons, and checkboxes

    const feedbackParagraphs = document.getElementsByClassName("feedback");
    for (let i = 0; i < feedbackParagraphs.length; i++) {
        feedbackParagraphs[i].textContent = "";
        feedbackParagraphs[i].className = "feedback";
    }

    resultsBox.innerHTML = "";
    resultsBox.style.display = "none";
});

} // end of "if (quizForm)" guard
