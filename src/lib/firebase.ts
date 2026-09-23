// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDs-FR_YXvc5GalLXchLbB2njs_qlc8uQ",
  authDomain: "abenpoadm.firebaseapp.com",
  projectId: "abenpoadm",
  storageBucket: "abenpoadm.firebasestorage.app",
  messagingSenderId: "176498973006",
  appId: "1:176498973006:web:54471fd53aad00b8f5661f",
  measurementId: "G-XHFE8C9F87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
