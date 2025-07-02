import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { auth } from './firebase-config.js';

// This function will run on every page that includes auth.js
function setupAuth() {
    // This part is safe because it only runs when the page is loaded
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                alert('Sign-out successful.');
                window.location.href = 'login.html'; // Redirect after logout
            }).catch((error) => {
                console.error('An error occurred during logout:', error);
            });
        });
    }

    // This handles the user's sign-in state across all pages
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User is signed in:', user.email);
            if (logoutButton) logoutButton.style.display = 'block';
        } else {
            console.log('User is signed out');
            if (logoutButton) logoutButton.style.display = 'none';
        }
    });
}

// Run the setup function once the page's HTML is ready
document.addEventListener('DOMContentLoaded', setupAuth);