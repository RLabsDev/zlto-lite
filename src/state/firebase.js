// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUkwrW_IW3BgOFKMKpUm7kjuPQmRCyBR8",
  authDomain: "zlto-lite-bf802.firebaseapp.com",
  projectId: "zlto-lite-bf802",
  storageBucket: "zlto-lite-bf802.appspot.com",
  messagingSenderId: "825634383426",
  appId: "1:825634383426:web:609a9d2de457181974afdb",
  measurementId: "G-WETYFDRG0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
