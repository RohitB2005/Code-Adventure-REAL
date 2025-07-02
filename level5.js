import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    
    // THE FIX: Define the answers as full, correct CSS rules with semicolons.
    const correctAnswers = {
        missile: {
            top: "top:55%;",
            left: "left:60%;"
        },
        rope: "display:none;",
        chandelier: "z-index:1;" // Your customized value
    };
    
    const submitButton = document.querySelector(".Submit");
    const nextLevelButton = document.querySelector(".NextLevel");

    // Show Answer button logic
    document.getElementById("showAnswerButton").addEventListener("click", () => {
        // This now shows the syntactically correct answer.
        document.querySelector(".code-input").value = 
`#MagicMissile {
  position: absolute;
  ${correctAnswers.missile.top}
  ${correctAnswers.missile.left}
}
#Rope {
  ${correctAnswers.rope}
}
#Chandelier {
  ${correctAnswers.chandelier}
}`;
    });

    // This function will play the entire choreographed victory sequence
    function runVictoryAnimation() {
        const missile = document.getElementById('MagicMissile');
        const rope = document.getElementById('Rope');
        const chandelier = document.getElementById('Chandelier');
        const guard = document.getElementById('Guard');
        const character = document.getElementById('Character');
    
        // This part uses the raw values, which we can extract from our answer strings
        missile.style.top = correctAnswers.missile.top.split(':')[1].replace(';', '');
        missile.style.left = correctAnswers.missile.left.split(':')[1].replace(';', '');
        rope.style.display = correctAnswers.rope.split(':')[1].replace(';', '');
        chandelier.style.zIndex = correctAnswers.chandelier.split(':')[1].replace(';', '');
        
        setTimeout(() => {
            missile.style.transform = 'scale(3)';
            missile.style.opacity = '0';
        }, 800);
        
        setTimeout(() => {
            guard.style.backgroundImage = "url('images/GUARDHURT.png')";
            guard.style.animation = 'guardHurt 0.5s steps(4) 1';
            chandelier.style.top = '55%';
        }, 800);
    
        setTimeout(() => {
            guard.style.animation = 'guardHurt 0.5s steps(4) 1';
        }, 1600);

        setTimeout(() => {
            character.style.animation = 'characterAttackAnimation 1.2s steps(11) 1';
        }, 2100);

        setTimeout(() => {
            guard.style.backgroundImage = "url('images/GUARDHURT.png')";
            guard.style.animation = 'guardHurt 0.5s steps(4) 1';
        }, 3300);

        setTimeout(() => {
            guard.style.backgroundImage = "url('images/GUARDDEATH.png')";
            guard.style.animation = 'guardDeath 1.5s steps(12) 1 forwards';
            setTimeout(() => {
                guard.style.animation = 'fadeOut 1s forwards';
            }, 1500);
        }, 3800);

        setTimeout(() => {
            character.style.animation = 'idle 1.7s infinite steps(5)';
        }, 5300);
    }


    async function checkAnswer() {
        // THE FIX: Normalize user input by only removing whitespace (spaces, tabs, newlines).
        const userAnswer = document.querySelector(".code-input").value.toLowerCase().replace(/\s/g, '');

        // THE FIX: The checks now look for the full "property:value;" string, including the semicolon.
        // It also checks that the rule is inside the correct selector's curly braces.
        const isMissileCorrect = userAnswer.includes('#magicmissile{') &&
                                 userAnswer.includes(correctAnswers.missile.top) && 
                                 userAnswer.includes(correctAnswers.missile.left);

        const isRopeCorrect = userAnswer.includes(`#rope{${correctAnswers.rope}}`);

        const isChandelierCorrect = userAnswer.includes(`#chandelier{${correctAnswers.chandelier}}`);
        
        if (isMissileCorrect && isRopeCorrect && isChandelierCorrect) {
            alert("A perfect combination! The guard is defeated!");
            runVictoryAnimation();
            
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    const currentLevel = userDoc.data()?.lastLevel || 1;
                    
                    if (6 > currentLevel) {
                        await setDoc(userDocRef, { lastLevel: 6 }, { merge: true });
                        console.log("Progress saved! Game completed (for now)!");
                    }
                }
            } catch (error) {
                console.error("CRITICAL: Failed to save progress!", error);
                return;
            }
            
            submitButton.style.display = "none";
            setTimeout(() => {
                nextLevelButton.style.display = "block";
                nextLevelButton.style.marginLeft = "78%";
            }, 6000); 
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

    // Dropdown navigation logic
    document.getElementById("lesson-select").addEventListener("change", function () {
        const selectedValue = this.value;
        const pageURLs = { "1":"index.html", "2":"level2.html", "3":"level3.html", "4":"level4.html", "5":"level5.html", "6":"error.html" };
        if (pageURLs[selectedValue]) {
            window.location.href = pageURLs[selectedValue];
        }
    });
});