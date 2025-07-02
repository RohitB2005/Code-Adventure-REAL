import { auth, db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const expectedProperties = ["#hidden-passage", "display:block"]; 
    
    const submitButton = document.querySelector(".Submit");
    const nextLevelButton = document.querySelector(".NextLevel");
    const character = document.getElementById("Character");
    const showAnswerButton = document.getElementById("showAnswerButton");

    showAnswerButton.addEventListener("click", () => {
        const codeInput = document.querySelector(".code-input");
        codeInput.value = `#hidden-passage {\n  display: block;\n}`;
    });

    async function checkAnswer() {
        const userAnswer = document.querySelector(".code-input").value.toLowerCase().replace(/\s/g, '');
        

        const isCorrect = userAnswer.includes("#hidden-passage{") && userAnswer.includes("display:block");

        if (isCorrect) {
            alert("Correct answer! The exit has been revealed.");
            document.getElementById('hidden-passage').style.display = 'block';
            const character = document.getElementById("Character");
            character.style.animation = 
        `runToDoor 2s ease-in forwards, run-individual-frames 0.6s infinite steps(1)`;

            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    await setDoc(userDocRef, { lastLevel: 4 }, { merge: true });
                    console.log("Progress saved! Level 4 is now unlocked.");
                }
            } catch (error) {
                console.error("CRITICAL: Failed to save progress!", error);
                alert("There was an error saving your progress. Please try again.");
                return;
            }
            
            submitButton.style.display = "none";
            setTimeout(() => {
                nextLevelButton.style.display = "block";
                nextLevelButton.style.marginLeft = "78%";
            }, 3000); 
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

    document.getElementById("lesson-select").addEventListener("change", function () {
        var selectedValue = this.value;
        var pageURLs = { 
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