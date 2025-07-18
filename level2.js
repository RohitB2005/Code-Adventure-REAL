import { auth, db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const escapeSound = new Audio('audio/cagebreak.mp3'); // First sound: e.g., breaking the cage
    const victoryFanfare = new Audio('audio/level2victory.mp3'); // Second sound: the victory music
    
    // Set the volume for each sound individually
    escapeSound.volume = 0.2; 
    victoryFanfare.volume = 0.2;

    const volumeToggle = document.getElementById('volume-toggle');
    
    // Check localStorage to remember the user's preference
    let isSoundOn = localStorage.getItem('soundEnabled') !== 'false';

    // Function to update the icon based on the sound state
    const updateVolumeIcon = () => {
        if (volumeToggle) {
            volumeToggle.src = isSoundOn ? 'images/unmute.png' : 'images/mute.png';
        }
    };

    // Set the initial icon when the page loads
    updateVolumeIcon();
   
    if (volumeToggle) {
        volumeToggle.addEventListener('click', () => {
            isSoundOn = !isSoundOn; // Flip the state for toggle
            localStorage.setItem('soundEnabled', isSoundOn); 
            updateVolumeIcon(); 
        });
    }
    const expectedProperties = ["#character {", "position: absolute;", /z-index: [1-9][0-9]*;/, "}"];
    const submitButton = document.querySelector(".Submit");
    const nextLevelButton = document.querySelector(".NextLevel");
    const character = document.getElementById("Character");
    const showAnswerButton = document.getElementById("showAnswerButton");

    showAnswerButton.addEventListener("click", () => {
        const codeInput = document.querySelector(".code-input");
        codeInput.value = `#character {\nposition: absolute;\nz-index: 1;\n}`;
    });

    async function checkAnswer() {
        const userAnswer = document.querySelector(".code-input").value.toLowerCase();
        const allPropertiesPresent = expectedProperties.every(property => {
            if (property instanceof RegExp) return property.test(userAnswer);
            return userAnswer.includes(property);
        });

        if (allPropertiesPresent) {
            alert("Correct answer! A smooth escape.");

            if (isSoundOn) {
                escapeSound.addEventListener('ended', () => {
                    victoryFanfare.play();
                }, { once: true });
                escapeSound.play();
                setTimeout(() => {victoryFanfare.play();}, 2700);
    
            }

            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);

                    const userDoc = await getDoc(userDocRef);
                    const currentLevel = userDoc.data()?.lastLevel || 1;
                    const nextLevel = 3;

                    // Only update if the user is actually progressing
                    if (nextLevel > currentLevel) {
                        await setDoc(userDocRef, { lastLevel: nextLevel }, { merge: true });
                        console.log("Progress saved! Level 3 is now unlocked.");
                    } else {
                        console.log("User has already passed this level. No progress update needed.");
                    }
                }
            } catch (error) {
                console.error("CRITICAL: Failed to save progress!", error);
                alert("There was an error saving your progress. Please try again.");
                return;
            }
          
            character.style.zIndex = "1";
            character.style.animation = "moveCharacter 2s linear, characterAttackAnimation 2s steps(1) 2";
            character.style.animationFillMode = "forwards";
            character.addEventListener("animationend", () => {
              character.style.animation = "idle 1.7s steps(1) infinite";
          });
            submitButton.style.display = "none";
            setTimeout(() => { nextLevelButton.style.display = "block"; nextLevelButton.style.marginLeft = "78%"; }, 5000);

        } else {
            submitButton.style.backgroundColor = "red";
            submitButton.textContent = "Incorrect";
            setTimeout(() => { submitButton.style.backgroundColor = "blue"; submitButton.textContent = "Submit"; }, 2000);
        }
    }

    submitButton.addEventListener("click", checkAnswer);

    document.getElementById("lesson-select").addEventListener("change", function () {
        var selectedValue = this.value;
        var pageURLs = { "1": "index.html", "2": "level2.html", "3": "level3.html", "4": "level4.html", "5": "level5.html", "6": "error.html"};
        if (pageURLs[selectedValue]) {
            window.location.href = pageURLs[selectedValue];
        }
    });
});