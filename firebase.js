// filepath: d:\Extra\Coollege\SE2526_Sem4\ITE4116M - FYP\Thing\firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNsI_tV0KE-hdnN_XGpQaus3vd5snJVxs",
  authDomain: "aigrading-2c9a9.firebaseapp.com",
  projectId: "aigrading-2c9a9",
  storageBucket: "aigrading-2c9a9.appspot.com",
  messagingSenderId: "121677391627",
  appId: "1:121677391627:web:f0fb8ab7a800299e94240e",
  measurementId: "G-DN7M6D9Q3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);