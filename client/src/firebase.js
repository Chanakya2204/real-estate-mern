// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:   import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-820e8.firebaseapp.com",
  projectId: "mern-estate-820e8",
  storageBucket: "mern-estate-820e8.appspot.com",
  messagingSenderId: "714600473902",
  appId: "1:714600473902:web:e5493261b5c7296fdf86bf"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);