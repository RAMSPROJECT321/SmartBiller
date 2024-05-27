import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getDatabase,ref,child,get,set,update,remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
     apiKey: "AIzaSyDydurEKNLQIYsgenH29sWXJEgKCvdY-js",
     authDomain: "ramsproject321-75e29.firebaseapp.com",
     databaseURL: "https://ramsproject321-75e29-default-rtdb.firebaseio.com",
     projectId: "ramsproject321-75e29",
     storageBucket: "ramsproject321-75e29.appspot.com",
     messagingSenderId: "400972635097",
     appId: "1:400972635097:web:8d98ea2531849aabfd17c8",
     measurementId: "G-WDY9Y6BL30"
};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

let Eid=document.getElementById('empId');
let password=document.getElementById('password');
let submit=document.getElementById('submit');   

function login(){
    const dbRef = ref(db);

    get(child(dbRef,'Employee_01/' + Eid.value)).then((snapshot)=>{
        if(snapshot.exists()){
            const data=snapshot.val();

            const storedPassword = String(data.Password); 
            const inputPassword = String(password.value);
            if(Eid.value === ""){
                alert("Enter Employee Id");
            }else if(inputPassword === ""){
                alert("Enter Your Password");
            }else if(storedPassword === inputPassword){
                console.log("password match");
                window.location.href = "dashboard.html";
            }else{
                alert("Wrong Password");
                password.value="";
            }
        }else{
            alert("Emp Not Exits");
            Eid.value="";
        }
        
    })
    .catch((error)=>{
        alert("Unsuccessful");
    })
}

submit.addEventListener('click',login);


