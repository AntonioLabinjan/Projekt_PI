import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: 'AIzaSyCAYR92SG0_uUrNdzg5TUL_2VwaOI1oQeM',
  authDomain: 'badass-todo-fb4dc.firebaseapp.com',
  projectId: 'badass-todo-fb4dc',
  storageBucket: 'badass-todo-fb4dc.appspot.com',
  messagingSenderId: '925150517547',
  appId: '1:925150517547:web:546bc343bd3430293e8d6e'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
    db,
    auth,
    storage
}
