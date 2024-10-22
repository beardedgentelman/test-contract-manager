// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0awTWCclKvD47VO1G7BDPzEy7Ml5i5wQ",
    authDomain: "test-8eb82.firebaseapp.com",
    projectId: "test-8eb82",
    storageBucket: "test-8eb82.appspot.com",
    messagingSenderId: "810307105777",
    appId: "1:810307105777:web:7d3889f4454901b7f20a50",
    measurementId: "G-SS36JBB03Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
