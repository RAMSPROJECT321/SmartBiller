
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import { getDatabase,ref,child,get,set,update,remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
 
  // Your web app's Firebase configuration
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

     let Ename=document.getElementById('name');
     let Eid=document.getElementById('empId');
     let Eemail=document.getElementById('email');
     let Epassword=document.getElementById('password');
     let Ephonenumber=document.getElementById('phoneNo');
     let submitbtn=document.getElementById('submit');

     function addDatadb(){
               set(ref(db,'Employee_01/' + Eid.value),{
                    PhoneNo:Ephonenumber.value,
                    Password:Epassword.value,
                    Email:Eemail.value,
                    Eid:Eid.value,
                    Ename:Ename.value
               })   
               .then(()=>{
                    alert("data added");
                    alert("You have successfully SignUp \n Now you can Login !!");
                    Ename.value="";
                    Eid.value="";
                    Eemail.value="";
                    Epassword.value="";
                    Ephonenumber.value="";
                    window.location.href = "index.html";
               })
               .catch((error)=>{
                    alert("Not Added");
                    console.log(error);
               })
     }
     
function addData(){
     if(Ename.value !="" && Eid.value!="" && Eemail.value!="" && Epassword.value!=""){
          // submitbtn.addEventListener('click',addDatadb);
          addDatadb();
          
          
     }else{
          alert("Fill all data");
     }
}

 submitbtn.addEventListener('click',addData);