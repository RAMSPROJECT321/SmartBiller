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
let submit=document.getElementById('submit'); 

let password=document.getElementById('password');
let cpassword=document.getElementById('cpassword');


function addDatadb(){
    // console.log(Eid_main);
    update(ref(db,'Employee_01/' + Eid.value),{
         Password:password.value,
    })   
    .then(()=>{
         alert("data updated. \n Now you can Login !!");
         window.location.href="login.html";
    })
    .catch((error)=>{
         alert("Not Updated.");
         console.log(error);
    })
}


function addData(){
if(password.value === cpassword.value){
// submitbtn.addEventListener('click',addDatadb);
addDatadb();
}else{
alert("Please Match the Password");
}
}

submit.addEventListener('click',addData);






let getOTP=document.getElementById('getOTP');
        const otpVerify = document.getElementsByClassName('otpverify')[0];
        const class_01 = document.getElementsByClassName('class_01')[0];
        const container_01 = document.getElementsByClassName('container_01')[0];
        const container_02 = document.getElementsByClassName('container_02')[0];
       
        const userEmail_01= document.getElementById('user-email');
        
        (function(){
            emailjs.init("IG2yiqWemCzCaJU3k"); // Replace 'YOUR_USER_ID' with your EmailJS user ID

            getOTP.addEventListener('click', function(event) {
               let canGetOtp = false;
               //  canGetOtp = false ;

                const dbRef = ref(db);
                console.log(userEmail_01);

               get(child(dbRef,'Employee_01/' + Eid.value)).then((snapshot)=>{
                    if(snapshot.exists()){
                         const data=snapshot.val();

                         const storedEmail = String(data.Email);
                         const enteredEmail = String(userEmail_01.value); 
                         console.log(enteredEmail);
                         if(enteredEmail === storedEmail){
                              canGetOtp = true;
                         }else{
                              alert("Wrong Email Id!!");
                              // password.value="";
                         }

                         if(canGetOtp === true){
                              event.preventDefault();
                              // Collect user inputs
                              //const userName = document.getElementById('user-name').value.trim();
                              const userName = 'RAMS Group';
                              const userEmail = document.getElementById('user-email').value.trim();
                              let otp_value = Math.floor(Math.random()*10000);
                              const otp = otp_value;
                              console.log("otp" ,otp);
                              // Prepare email parameters
                              const emailParams = {
                                  from_name: userName,
                                  to_name: 'Recipient_0111', // Change to the recipient's name if needed
                                  //message_html: message,
                                  reply_to: userEmail,
                                  OTP:otp
                              };
              
                              // Send email
                              emailjs.send('service_nyl10wr', 'template_zpmr5wh', emailParams)
                                  .then(function(response) {
                                      console.log('Email sent:', response);
                                      alert('Email sent successfully!');
              
                                      otpVerify.style.display = "block";
                                      class_01.style.display = "none";
                                      const otp_inp = document.getElementById('otp_inp');
                                      const otp_btn = document.getElementById('otp_btn');
              
                                      otp_btn.addEventListener('click',()=>{
                                          if(otp_inp.value == otp_value ){
                                          alert("OTP Verified");
                                          //window.location.href="reSetPassword.html";
                                          container_01.style.display = "none";
                                          container_02.style.display = "block";
                                          }else{
                                          alert("Invalid OTP");
                                          }
                                      })
                                  }, function(error) {
                                      console.error('Error sending email:', error);
                                      alert('Failed to send email. Please try again later.');
                                  });
                             }
                    }else{
                         alert("Emp Not Exits");
                         Eid.value="";
                         userEmail_01.value="";
                    }
                    
               })
               .catch((error)=>{
                    alert("Unsuccessful");
               })
            });
        })();