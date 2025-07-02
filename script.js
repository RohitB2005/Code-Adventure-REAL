import { auth, db } from './firebase-config.js';
// THE FIX: Import setDoc instead of updateDoc
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const expectedProperties = ["#character {", "position: relative;", "top: 63%;", "left: 73%;", "}"];
    const submitButton = document.querySelector(".Submit");
    const nextLevelButton = document.querySelector(".NextLevel");
    const character = document.getElementById("Character");
    const showAnswerButton = document.getElementById("showAnswerButton");

    showAnswerButton.addEventListener("click", () => {
        const codeInput = document.querySelector(".code-input");
        codeInput.value = expectedProperties.join("\n");
    });

    async function checkAnswer() {
        const userAnswer = document.querySelector(".code-input").value.toLowerCase();
        const allPropertiesPresent = expectedProperties.every(property => userAnswer.includes(property));

        if (allPropertiesPresent) {
            alert("Correct answer!");
            
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    // THE FIX: Use setDoc with merge to create or update the document.
                    await setDoc(userDocRef, { lastLevel: 2 }, { merge: true });
                    console.log("Progress saved! Level 2 is now unlocked.");
                }
            } catch (error) {
                console.error("CRITICAL: Failed to save progress!", error);
                alert("There was an error saving your progress. Please try again.");
                return;
            }

            // This code now only runs AFTER the database is safely updated.
            character.style.top = "63%";
            character.style.left = "62%";
            character.style.animation = "moveCharacter 2s linear, characterAnimation 0.5s steps(1) 4";
            character.style.animationFillMode = "forwards";
            setTimeout(() => { 
                const swordItem = document.getElementById("SwordItem");
                if (swordItem) {
                    swordItem.style.animation = "hideSword 0s linear";
                    swordItem.style.animationFillMode = "forwards";
                }
            }, 3000);
            setTimeout(() => { character.style.animation = "newIdleAnimation 1.7s infinite steps(5)"; }, 3000);
            
            submitButton.style.display = "none";
            setTimeout(() => { nextLevelButton.style.display = "block"; nextLevelButton.style.marginLeft = "78%" }, 5000);

        } else {
            submitButton.style.backgroundColor = "red";
            submitButton.textContent = "Incorrect";
            setTimeout(() => { submitButton.style.backgroundColor = "blue"; submitButton.textContent = "Submit"; }, 2000);
        }
    }

    submitButton.addEventListener("click", checkAnswer);

    document.getElementById("lesson-select").addEventListener("change", function () {
        var selectedValue = this.value;
        var pageURLs = { "1": "index.html", "2": "level2.html", "3": "error.html"};
        if (pageURLs[selectedValue]) { window.location.href = pageURLs[selectedValue]; }
    });
});