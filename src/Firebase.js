// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2fRTsiuTgiCwikhKEyKS6FcObMlL2Qqs",
  authDomain: "dropdown-2a617.firebaseapp.com",
  projectId: "dropdown-2a617",
  storageBucket: "dropdown-2a617.appspot.com",
  messagingSenderId: "756585281618",
  appId: "1:756585281618:web:a4ecf6c786dc1ccc43c78b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database= getFirestore(app)

export default database