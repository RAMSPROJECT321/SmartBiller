import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDydurEKNLQIYsgenH29sWXJEgKCvdY-js",
    authDomain: "ramsproject321-75e29.firebaseapp.com",
    databaseURL: "https://ramsproject321-75e29-default-rtdb.firebaseio.com",
    projectId: "ramsproject321-75e29",
    storageBucket: "ramsproject321-75e29.appspot.com",
    messagingSenderId: "400972635097",
    appId: "1:400972635097:web:2590d62fd98151d1fd17c8",
    measurementId: "G-0254C2WB44"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { firebaseConfig, app , db };
