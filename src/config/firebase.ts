// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADn7nnqJ0qttfY5AH4m-6rAnu1p_QMam8",
  authDomain: "chatapp-3f396.firebaseapp.com",
  projectId: "chatapp-3f396",
  storageBucket: "chatapp-3f396.firebasestorage.app",
  messagingSenderId: "394220302237",
  appId: "1:394220302237:web:bc559d1725edeead9e8974",
  measurementId: "G-SGKNKPVFDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const auth =getAuth(app);
export const provider = new GoogleAuthProvider;
export default app;