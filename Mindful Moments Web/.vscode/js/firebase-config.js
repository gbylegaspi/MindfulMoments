// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7VnFgdjrKpdFIsoFl3VCCWEe80bJJ6OE",
  authDomain: "mindful-moments-web-2a41e.firebaseapp.com",
  projectId: "mindful-moments-web-2a41e",
  storageBucket: "mindful-moments-web-2a41e.firebasestorage.app",
  messagingSenderId: "335604171608",
  appId: "1:335604171608:web:e44bc7e1bd4e22f803db2d",
  measurementId: "G-XQNB9FFVGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 