const expectedProperties = ["position: relative;", "top: 63%;", "left: 73%;", "}"]; /* Store each necessary part of the answer in an array */

const submitButton = document.querySelector(".Submit"); /* Setting the submit button to relay to check the code */

const character = document.getElementById("Character");


submitButton.addEventListener("click", checkAnswer); /* Runs function when submit button clicked*/

function checkAnswer() {
  const userAnswer = document.querySelector(".code-input").value.toLowerCase(); /* Convert user answer to lower case, avoiding case sensitivity */

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

