import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAxHOHz3JJ70KBnh-YGdk5-MHa6idsBzA",
  authDomain: "vestedog.firebaseapp.com",
  projectId: "vestedog",
  storageBucket: "vestedog.appspot.com",
  messagingSenderId: "944538624990",
  appId: "1:944538624990:web:758a654f5e264ed0d3734f",
  measurementId: "G-CF1P3RBP3C",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
