import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXxn8MhceUf7E9fXS1dfJP0ls_XhgIz_0",
    authDomain: "user-registration-17df4.firebaseapp.com",
    projectId: "user-registration-17df4",
    storageBucket: "user-registration-17df4.appspot.com",
    messagingSenderId: "504486160705",
    appId: "1:504486160705:web:9abe0f671161e7de0e59c0",
    measurementId: "G-Q1NHBSZ192"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);