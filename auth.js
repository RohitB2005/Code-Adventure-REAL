/* Import the functions you need from the SDKs you need */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCXxn8MhceUf7E9fXS1dfJP0ls_XhgIz_0",
    authDomain: "user-registration-17df4.firebaseapp.com",
    projectId: "user-registration-17df4",
    storageBucket: "user-registration-17df4.appspot.com",
    messagingSenderId: "504486160705",
    appId: "1:504486160705:web:9abe0f671161e7de0e59c0",
    measurementId: "G-Q1NHBSZ192"
  };


/* Initialize Firebase */
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

/* Save login state across pages/reloads */
auth.onAuthStateChanged(function(user) {
  if (user) {
    /* Response if a user is signed in */
    console.log('User is signed in:', user.email);
    document.getElementById('logout').style.display = 'block';
  } else {
    /* Response if a user is signed out */
    console.log('User is signed out');
    document.getElementById('logout').style.display = 'none';
  }
});

/* Logout code start */
document.getElementById("logout").addEventListener("click", function() {
  signOut(auth).then(() => {
    /* Sign-out successful. */
    console.log('Sign-out successful.');
    alert('Sign-out successful.');
  }).catch((error) => {
    /* If an error occurrs */
    console.error('An error occurred:', error);
  });
});

/* New Registration code */
document.getElementById("signup-button").addEventListener("click", function() {
  var signupEmail = document.getElementById("signup-email").value;
  var signupPassword = document.getElementById("signup-password").value;

// In the registration code
createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);

    // Initialize the user's last level as 1
    setDoc(userDocRef, { lastLevel: 1 });

    alert(`${user.email}, Welcome to Code Adventure! You are currently up to level 1.`);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    alert(errorMessage);
  });
});

/* Login code */
document.getElementById("login-button").addEventListener("click", function() {
  var email = document.getElementById("login-email").value;
  var password = document.getElementById("login-password").value;

  /* In the login code */
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);

      /* Check the user's last level from Firestore database */
      const userDoc = await getDoc(userDocRef);
      const lastLevel = userDoc.data()?.lastLevel || 1; /* Default to 1 if no level is found */

      /* Display the last level reached in the login alert */
      alert(`${user.email}, Welcome Back! You have currently reached level ${lastLevel}`);
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    });
});



