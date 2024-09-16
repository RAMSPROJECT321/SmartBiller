import { db } from './firebase-config.js';
import { ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";



document.querySelector('nav ul').addEventListener('click', function(event) {
    // Check if the clicked element is a link (a tag) within the navigation list
    if (event.target.tagName === 'A') {
      // Remove the 'active' class from all links
      document.querySelectorAll('nav ul a').forEach(link => link.classList.remove('iactive'));
      // Add the 'active' class to the clicked link
      event.target.classList.add('iactive');
      
      // Load the corresponding page using loadPage function
    //   loadPage(event.target.textContent.trim().toLowerCase()); // Extract link text and convert to lowercase
    }
  });
  

// Function to load external HTML pages into the content div
function loadPage(page) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', page, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('index_content').innerHTML = xhr.responseText;
            setupPage(page); // Setup event listeners for dynamically loaded content
            if(page === 'login.html'){
              document.getElementById('SignUpPage').classList.remove('iactive');
              document.getElementById('loginPage').classList.add('iactive');
            }else if(page === 'SignUp.html'){
              document.getElementById('loginPage').classList.remove('iactive');
              document.getElementById('SignUpPage').classList.add('iactive');
            }
        }
    };
    xhr.send();
}
loadPage('login.html');

function setupPage(page) {
  if(page === 'login.html'){
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

    //For Password Icon
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');
        const passwordField = document.getElementById('password');

        togglePasswordIcon.addEventListener('click', function () {
            // Toggle the type attribute between "password" and "text"
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle between eye and eye-slash icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    submit.addEventListener('click',login);
  }else if(page === 'SignUp.html'){
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
                    // loadPage('login.html');
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

    //For Password Icon
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');
        const passwordField = document.getElementById('password');

        togglePasswordIcon.addEventListener('click', function () {
            // Toggle the type attribute between "password" and "text"
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle between eye and eye-slash icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });


    submitbtn.addEventListener('click',addData);
  }else if(page === 'forgotPassword.html'){
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
            // window.location.href="index.html";
            window.location.href = "index.html";
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
  }
}

window.loadPage = loadPage; // Export loadPage function for use in inline onclick attributes
