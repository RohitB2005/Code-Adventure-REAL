import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';


window.clickLogin = () => {
    document.querySelector(".login").style.transform = "translateX(0)";
    document.querySelector(".signup").style.transform = "translateX(90%)";
    document.querySelector("#undertab").style.left = "0";
    document.querySelector("#undertab").style.right = 'auto';
};

window.clickSignup = () => {
    document.querySelector(".login").style.transform = "translateX(-90%)";
    document.querySelector(".signup").style.transform = "translateX(0)";
    document.querySelector("#undertab").style.left = 'auto';
    document.querySelector("#undertab").style.right = "0";
};

// This part runs after the page has loaded to safely attach listeners to the buttons.
document.addEventListener('DOMContentLoaded', () => {
    // Check URL on page load to show the correct form by default
    if (window.location.hash === '#signup') {
        clickSignup();
    } else {
        clickLogin();
    }
    
    // --- Login/Signup Form Submission Logic ---
    const signupButton = document.getElementById("signup-button");
    const loginButton = document.getElementById("login-button");

    signupButton.addEventListener("click", () => {
        const signupEmail = document.getElementById("signup-email").value;
        const signupPassword = document.getElementById("signup-password").value;

        createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                const userDocRef = doc(db, "users", user.uid);
                setDoc(userDocRef, { lastLevel: 1 });
                alert(`Welcome, ${user.email}! Let the adventure begin.`);
                window.location.href = 'index.html';
            })
            .catch((error) => alert(error.message));
    });

    loginButton.addEventListener("click", () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                const lastLevel = userDoc.data()?.lastLevel || 1;
                alert(`Welcome Back! Resuming at level ${lastLevel}.`);
                const destination = lastLevel === 1 ? 'index.html' : `level${lastLevel}.html`;
                window.location.href = destination;
            })
            .catch((error) => alert(error.message));
    });
});
