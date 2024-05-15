document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Your login logic here
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log("Username: " + username + ", Password: " + password);

    // For demonstration, just log the username and password
    // Replace this with your actual login logic
});


function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // You can replace this with your actual validation logic
    if (username === "username" && password === "pass") {
        // alert("Login successful");
        window.location.href = "dashboard.html";
        return true;
    } else {
        alert("Invalid username or password");
        return false;
    }
}