import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const expectedAnswer = "transform:rotate(-90deg)";
    
    const submitButton = document.querySelector(".Submit");
    const nextLevelButton = document.querySelector(".NextLevel");
    const bridge = document.getElementById("Bridge");

    // Show Answer button logic
    document.getElementById("showAnswerButton").addEventListener("click", () => {
        document.querySelector(".code-input").value = `#Bridge {\n  transform: rotate(-90deg);\n}`;
    });

    async function checkAnswer() {
        const userAnswer = document.querySelector(".code-input").value.toLowerCase().replace(/\s/g, '');

        if (userAnswer.includes(expectedAnswer)) {
            alert("Correct! The bridge swings into place.");
            
            bridge.style.transform = "rotate(0deg)";
            
            // Get character and food elements for the success animation ---
            const character = document.getElementById("Character");
            const food = document.getElementById("Food");

            // Wait for bridge to rotate, then run to the food ---
            setTimeout(() => {
                character.style.animation = 
                    `runAcrossBridge 1.5s linear forwards, run-individual-frames 0.6s infinite steps(1)`;

                    const onRunComplete = () => {
                        character.removeEventListener('animationend', onRunComplete);
                        character.style.top = '-3%'; 

                        // Switch back to the normal idle animation.
                        character.style.animation = `idle 1.7s infinite steps(5)`;
            
                        if (food) {
                            food.style.opacity = '0';
                        }
                    };
            
                    // Listen for when any animation on the character finishes.
                    character.addEventListener('animationend', onRunComplete);
                    character.style.animation = 
                        `runAcrossBridge 1.5s linear forwards, run-individual-frames 0.6s steps(6) 2`; // Plays the 6 frames twice
            
                }, 1500);


            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    const currentLevel = userDoc.data()?.lastLevel || 1;
                    
                    // UNLOCK LEVEL 5
                    if (5 > currentLevel) {
                        await setDoc(userDocRef, { lastLevel: 5 }, { merge: true });
                        console.log("Progress saved! Level 5 is now unlocked.");
                    }
                }
            } catch (error) {
                console.error("CRITICAL: Failed to save progress!", error);
                alert("There was an error saving your progress.");
                return;
            }
            
            submitButton.style.display = "none";

            setTimeout(() => {
                nextLevelButton.style.display = "block";
                nextLevelButton.style.marginLeft = "78%";
            }, 3500); // 1.5s for bridge + 1.5s for run + buffer

        } else {
            submitButton.style.backgroundColor = "red";
            submitButton.textContent = "Incorrect";
            setTimeout(() => {
                submitButton.style.backgroundColor = "blue";
                submitButton.textContent = "Submit";
            }, 2000);
        }
    }

    submitButton.addEventListener("click", checkAnswer);

    // Update the dropdown navigation map
    document.getElementById("lesson-select").addEventListener("change", function () {
        const selectedValue = this.value;
        const pageURLs = { 
            "1": "index.html", 
            "2": "level2.html", 
            "3": "level3.html", 
            "4": "level4.html"
        };
        if (pageURLs[selectedValue]) {
            window.location.href = pageURLs[selectedValue];
        } 
    });
});