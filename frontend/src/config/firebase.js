// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwdJWfF8zzZoEmq5QudyrSd4ffY1G3EwU",
  authDomain: "finalyearproject-35ec5.firebaseapp.com",
  projectId: "finalyearproject-35ec5",
  storageBucket: "finalyearproject-35ec5.appspot.com",
  messagingSenderId: "967053333212",
  appId: "1:967053333212:web:7620dc99b2e8ca84411a19",
  measurementId: "G-05HLXHZJJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;