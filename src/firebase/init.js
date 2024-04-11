// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl-SC9Geie_6QFRM6SJElP8ZY-qhBdkus",
  authDomain: "trainingapp-255dc.firebaseapp.com",
  projectId: "trainingapp-255dc",
  storageBucket: "trainingapp-255dc.appspot.com",
  messagingSenderId: "916045185222",
  appId: "1:916045185222:web:2e02cb1e300f95725757c7"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase app:", error);
}

export default db;
