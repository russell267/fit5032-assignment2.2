// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMkwPvFmifzgVg7ihVyUaOvJKd1BfWxdw",
  authDomain: "week7-jiaquanli.firebaseapp.com",
  projectId: "week7-jiaquanli",
  storageBucket: "week7-jiaquanli.firebasestorage.app",
  messagingSenderId: "704856679238",
  appId: "1:704856679238:web:d59830b036d70b26d17b47"
};

// Initialize Firebase
//initializeApp(firebaseConfig);
//const db = getFirestore();
//export default db;
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const auth = getAuth(app)
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth).catch(e => console.error('Anon sign-in failed:', e))
  }
})
export { db, auth }