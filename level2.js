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


const expectedProperties = ["#character {", "position: absolute;", /z-index: [1-9][0-9]*;/, "}"]; /* Store each necessary part of the answer in an array */

const submitButton = document.querySelector(".Submit"); /* Setting the submit button to relay to check the code */

const nextLevelButton = document.querySelector(".NextLevel");

const character = document.getElementById("Character");

const showAnswerButton = document.getElementById("showAnswerButton");

showAnswerButton.addEventListener("click", () => {
  /* Get/relate to the code editor element */
  const codeInput = document.querySelector(".code-input");

  /* Set the correct answer into the textarea, in this case 1, although any positive integer>0 is still correct */
   codeInput.value = `#character {\nposition: absolute;\nz-index: 1;\n}`;
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

  /* Check if all expected properties and values are present in the user's answer. Test if the user's z-index value is an integer>0 to flag as correct */
  const allPropertiesPresent = expectedProperties.every(property => {
    if (property instanceof RegExp) {
      return property.test(userAnswer);
    }
    return userAnswer.includes(property);
  });

  /* When a users answer does not incldue all expected properties, display an incorrect message, and if matchng, display correct message */
  if (allPropertiesPresent) {
    alert("Correct answer!");
    character.style.zIndex = "1";
    character.style.animation = "moveCharacter 2s linear, characterAttackAnimation 2s steps(1) 2";
    character.style.animationFillMode = "forwards";

    character.addEventListener("animationend", function() {
    character.style.animation = "idle 1.7s steps(1) infinite"; /*Plays preset animations */
    });
    
    /* Hide the submit button and display the next level button after a short delay */
    submitButton.style.display = "none";
    setTimeout(() => {
      nextLevelButton.style.display = "block";
      nextLevelButton.style.marginLeft = "78%"
    }, 5000);

    const user = auth.currentUser; // Get the current user
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      // Update the user's last level to 3 (or the next level they are going to)
      setDoc(userDocRef, { lastLevel: 3 })
        .then(() => {
          console.log("User's last level updated to 3");
        })
        .catch((error) => {
          console.error("Error updating last level:", error);
        });
    }
  } else {
    submitButton.style.backgroundColor = "red";
    submitButton.textContent = "Incorrect"; /* Revert the button to its original state after 2 seconds */
    setTimeout(() => {
      submitButton.style.backgroundColor = "blue";
      submitButton.textContent = "Submit";
    }, 2000);
  }
}

