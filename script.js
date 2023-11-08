const expectedProperties = ["#character {", "position: relative;", "top: 63%;", "left: 73%;", "}"]; /* Store each necessary part of the answer in an array */

const submitButton = document.querySelector(".Submit"); /* Setting the submit button */

const nextLevelButton = document.querySelector(".NextLevel");

const character = document.getElementById("Character");

const showAnswerButton = document.getElementById("showAnswerButton");

showAnswerButton.addEventListener("click", () => {
  /* Get/relate to the code editor element */
  const codeInput = document.querySelector(".code-input");

  /* Set the correct answer into the textarea */
  codeInput.value = expectedProperties.join("\n");
});



submitButton.addEventListener("click", checkAnswer); /* Runs function when submit button clicked*/

function checkAnswer() {
  const userAnswer = document.querySelector(".code-input").value.toLowerCase(); /* Convert user answer to lower case, avoiding case sensitivity */

  /* Setting valid characters to not be flagged as invalid */
  const validCharactersPattern = /^[a-zA-Z0-9\s.,;:'"!@#$%^&*()-_=+<>?/\\[\]{}|`~]+$/;

  /* Check if the answer contains any invalid characters */
  if (!validCharactersPattern.test(userAnswer)) {
    alert("Invalid characters, like emojis, are not allowed in your answer.");
    return;
  }
  

  /* Setting boundaries(max and min characters) so users know how much to write */
  if (userAnswer.length > 100) {
    alert("Your answer is too long. Please shorten your answer.");
    return; /* Exit the function and stop further execution */
  }

  if (userAnswer.length<20) {
    alert("Your answer is too short. Please write more in your answer.");
    return;
  }
  /* Check if all expected properties and values are present in the user's answer */
  const allPropertiesPresent = expectedProperties.every(property => userAnswer.includes(property));

  /* When a users answer does not incldue all expected properties, display an incorrect message, and if matchng, display correct message */
  if (allPropertiesPresent) {
    alert("Correct answer!");
    character.style.top = "63%";
    character.style.left = "62%";

    character.style.animation = "moveCharacter 2s linear, characterAnimation 0.5s steps(1) 4";
    character.style.animationFillMode = "forwards";

    /* Hide the sword once the new idle animation begins */
    setTimeout (() => {
    const swordItem = document.getElementById("SwordItem");
    swordItem.style.animation = "hideSword 0s linear";
    swordItem.style.animationFillMode = "forwards";
    }, 3000);

    /* Apply the new idle animation after the first animation is finished */
    setTimeout(() => {
      character.style.animation = "newIdleAnimation 1.7s infinite steps(5)";
    }, 3000);

    /* Hide the submit button and display the next level button after a short delay */
    submitButton.style.display = "none";
    setTimeout(() => {
      nextLevelButton.style.display = "block";
      nextLevelButton.style.marginLeft = "78%"
    }, 5000);
  } else {
    submitButton.style.backgroundColor = "red";
    submitButton.textContent = "Incorrect";
    /* Revert the button to its original state after 2 seconds */
        setTimeout(() => {
          submitButton.style.backgroundColor = "blue";
          submitButton.textContent = "Submit";
        }, 2000);
      }
    }

document.getElementById("lesson-select").addEventListener("change", function () {
  var selectedValue = this.value;

  /* Define the page URLs for each option */
    var pageURLs = {
      "1": "index.html",
      "2": "level2.html",
      "3": "error.html",
      "4": "error.html",
      "5": "error.html",
      "6": "error.html",
      "7": "error.html",
      "8": "error.html",
      "9": "error.html",
      "10": "error.html",
    /* Add more URLs for future levels when created */
  };

  /* Redirect user to the selected page */
  if (pageURLs[selectedValue]) {
    window.location.href = pageURLs[selectedValue];
  }
});


