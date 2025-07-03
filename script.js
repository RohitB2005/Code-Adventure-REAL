import { auth, db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { inject } from "@vercel/analytics"

document.addEventListener("DOMContentLoaded", () => {
    const completionSound = new Audio('audio/level1victory.mp3');
    completionSound.volume = 0.2;
    const volumeToggle = document.getElementById('volume-toggle');
    
    // Check localStorage to remember the user's preference
    let isSoundOn = localStorage.getItem('soundEnabled') !== 'false';

    // Function to update the icon based on the sound state
    const updateVolumeIcon = () => {
        volumeToggle.src = isSoundOn ? 'images/unmute.png' : 'images/mute.png';
    };

    // Set the initial icon when the page loads
    updateVolumeIcon();

   
    volumeToggle.addEventListener('click', () => {
        isSoundOn = !isSoundOn; // Flip the state for toggle
        localStorage.setItem('soundEnabled', isSoundOn); 
        updateVolumeIcon(); 
    });
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
            alert("Correct answer! The sword has been claimed.");
            if (isSoundOn) {
                completionSound.play();
            }
            
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    
                  
                    const userDoc = await getDoc(userDocRef);
                    const currentLevel = userDoc.data()?.lastLevel || 1;
                    const nextLevel = 2;

                    // Only update if the user is actually progressing
                    if (nextLevel > currentLevel) {
                        await setDoc(userDocRef, { lastLevel: nextLevel }, { merge: true });
                        console.log("Progress saved! Level 2 is now unlocked.");
                    } else {
                        console.log("User has already passed this level. No progress update needed.");
                    }
                }
            } catch (error) {
                console.error("CRITICAL: Failed to save progress!", error);
                alert("There was an error saving your progress. Please try again.");
                return;
            }

            
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
            // incorrect answer code
            submitButton.style.backgroundColor = "red";
            submitButton.textContent = "Incorrect";
            setTimeout(() => { submitButton.style.backgroundColor = "blue"; submitButton.textContent = "Submit"; }, 2000);
        }
    }

    submitButton.addEventListener("click", checkAnswer);

    document.getElementById("lesson-select").addEventListener("change", function () {
        var selectedValue = this.value;
        var pageURLs = { "1": "index.html", "2": "level2.html", "3": "level3.html", "4": "level4.html", "5": "level5.html", "6": "error.html"};
        if (pageURLs[selectedValue]) { window.location.href = pageURLs[selectedValue]; }
    });
});