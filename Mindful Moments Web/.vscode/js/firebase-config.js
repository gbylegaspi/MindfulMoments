
const firebaseConfig = {
  apiKey: "AIzaSyD7VnFgdjrKpdFIsoFl3VCCWEe80bJJ6OE",
  authDomain: "mindful-moments-web-2a41e.firebaseapp.com",
  projectId: "mindful-moments-web-2a41e",
  storageBucket: "mindful-moments-web-2a41e.firebasestorage.app",
  messagingSenderId: "335604171608",
  appId: "1:335604171608:web:e44bc7e1bd4e22f803db2d",
  measurementId: "G-XQNB9FFVGX"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);
const auth = firebase.auth(app);
const db = firebase.firestore(app); 