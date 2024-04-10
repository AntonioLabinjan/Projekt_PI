// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const db = getFirestore()
export default db