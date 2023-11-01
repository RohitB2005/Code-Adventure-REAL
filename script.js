const presetAnswers = ["hello world", "hi there", "howdy"]; /* Store multiple correct answers in an array */

const submitButton = document.querySelector(".Submit"); /* Setting the submit button to relay to check the code */

submitButton.addEventListener("click", checkAnswer); /* Runs function when submit button clicked*/

function checkAnswer() {
  const userAnswer = document.querySelector(".code-input").value.toLowerCase(); /* Convert user's answer to lowercase */

  
  if (presetAnswers.includes(userAnswer)) { /* Check if the users answer matches the preset answer, and what happens when these match */
    alert("Correct answer!");
  } else {
    alert("Incorrect answer. Please try again.");
  }
  /* When a users answer does not match the preset, display an incorrect message */
}

