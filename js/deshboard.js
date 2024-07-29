import { app, db } from './firebase-config.js';
import { ref as ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage,ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


// Add event listener to the navigation list (ul)
document.querySelector('nav ul').addEventListener('click', function (event) {
    // Check if the clicked element is a link (a tag) within the navigation list
    if (event.target.tagName === 'A') {
        // Remove the 'active' class from all links
        document.querySelectorAll('nav ul a').forEach(link => link.classList.remove('active'));
        // Add the 'active' class to the clicked link
        event.target.classList.add('active');

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
            document.getElementById('content').innerHTML = xhr.responseText;
            setupPage(page); // Setup event listeners for dynamically loaded content
        }
    };
    xhr.send();
}




var finalPrice = 0;
var studentId = "";
function start_Camera() {
    const videoElement = document.getElementById('cameraFeed');
    if (videoElement) {
        console.log("I am Inside Start_Camera Function");
        videoElement.src = '';
        // videoElement.src = 'http://127.0.0.1:5000/video_feed'; 

        fetch('http://127.0.0.1:5000/video_feed')
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // Set the src to display the feed
                videoElement.src = 'http://127.0.0.1:5000/video_feed';
            })
            .catch(error => console.error('Error:', error));
    }
}
// Function to setup event listeners for dynamically loaded content
function setupPage(page) {

    function stopMainCamera() {
        fetch('http://127.0.0.1:5000/stop_camera')
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // cameraFeed.src = ''; // Clear the src to stop
            })
            .catch(error => console.error('Error:', error));
    }

    if (page === 'student.html') {
        // console.log("StudentPage");
        stopMainCamera();
        let isCameraOn = false;


        const cameraFeed = document.getElementById('cameraFeed');
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');


        function startCamera() {
            isCameraOn = true;
            cameraFeed.src = 'image/gif_loading.gif';
            fetch('http://127.0.0.1:5000/start_camera')
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    cameraFeed.src = 'http://127.0.0.1:5000/video_feed';
                })
                .catch(error => console.error('Error:', error));
        }


        function stopCamera() {
            isCameraOn = false;
            fetch('http://127.0.0.1:5000/stop_camera')
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    cameraFeed.src = ''; // Clear the src to stop
                })
                .catch(error => console.error('Error:', error));
            location.reload();
        }

        startButton.addEventListener('click', startCamera);
        stopButton.addEventListener('click', stopCamera);

        // Stop camera when window is closed
        window.addEventListener('beforeunload', stopCamera);


        let selectedStudentId = null;

        const studentName = document.getElementById('studentName');
        const studentId = document.getElementById('studentId');
        const course = document.getElementById('course');
        const balance = document.getElementById('balance');
        const email = document.getElementById('email');
        const btnAdd = document.getElementById('addStudent');
        const btnUpdate = document.getElementById('updateStudent');
        const btnDelete = document.getElementById('deleteStudent');
        const btnClear = document.getElementById('clearFormButton');

        //Load Function

        function loadStudents() {
            const dbRef = ref(db, 'Student');
            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const students = snapshot.val();
                    const studentsTableBody = document.getElementById('studentsTableBody');
                    studentsTableBody.innerHTML = ''; // Clear the table body

                    for (const key in students) {
                        if (students.hasOwnProperty(key)) {
                            const student = students[key];
                            const row = document.createElement('tr');
                            const studentNameCell = document.createElement('td');
                            const studentIdCell = document.createElement('td');
                            const courseCell = document.createElement('td');
                            const balanceCell = document.createElement('td');
                            const emailCell = document.createElement('td');

                            studentNameCell.textContent = student.StudentName;
                            studentIdCell.textContent = student.StudentId;
                            courseCell.textContent = student.Course;
                            balanceCell.textContent = student.Balance;
                            emailCell.textContent = student.Email;

                            row.appendChild(studentNameCell);
                            row.appendChild(studentIdCell);
                            row.appendChild(courseCell);
                            row.appendChild(balanceCell);
                            row.appendChild(emailCell);
                            row.addEventListener('click', () => selectRow(row, student));

                            studentsTableBody.appendChild(row);
                        }
                    }
                } else {
                    console.log("No data available");
                    const studentsTableBody = document.getElementById('studentsTableBody');
                    studentsTableBody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
                }
            }).catch((error) => {
                console.error("Error retrieving data: ", error);
            });
        }

        async function addStudent() {

            if (studentName.value.trim() === '' || studentId.value.trim() === '' || course.value.trim() === '' || balance.value.trim() === '' || email.value.trim() === '') {
                alert("All fields are required.");
                return;
            } else if (isCameraOn === false) {
                alert("Please turn on your camera to add a student.");
                return;
            }
            const studentIdValue = studentId.value;
            let canAddData = false;
            try {
                // Captureing image (Storing in database).
                const response = await fetch('http://127.0.0.1:5000/capture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'username': studentIdValue
                    })
                });
                const data = await response.json();
                let imgUrl;
                if (data.status === 'success' || data.message === 'stored') {
                    canAddData = true;
                    imgUrl = data.image_url;
                    console.log('canAddData set to true');
                } else {
                    console.log('canAddData remains false');
                }
                alert(data.message || data.error);

                //Here i have to find url so that i can easily store in the next line of code 


                if (canAddData === true) {

                    const dbRef = ref(db, 'Student/' + studentIdValue);

                    get(dbRef).then((snapshot) => {
                        if (snapshot.exists()) {
                            alert("Student with this ID already exists");
                        } else {
                            set(dbRef, {
                                StudentName: studentName.value,
                                StudentId: studentIdValue,
                                Course: course.value,
                                Balance: balance.value,
                                Email: email.value,
                                imageUrl: imgUrl
                            })
                                .then(() => {
                                    alert("Student Added");
                                    loadStudents(); // Refresh the data after adding a new student
                                    clearForm(); // Clear the input fields
                                })
                                .catch((error) => {
                                    console.error("Error adding student: ", error);
                                });
                        }
                    }).catch((error) => {
                        console.error("Error checking student ID: ", error);
                    });
                } else {
                    alert("Only One Face is Allowes at a time");
                    return;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function deleteStudent() {
            if (selectedStudentId) {
                remove(ref(db, 'Student/' + selectedStudentId))
                    .then(() => {
                        alert("Student Deleted");
                        loadStudents(); // Refresh the data after deleting the student
                        selectedStudentId = null; // Reset the selected student ID
                        clearForm(); // Clear the input fields
                        studentId.removeAttribute('readonly'); // Make student ID editable again
                    })
                    .catch((error) => {
                        console.error("Error deleting student: ", error);
                    });
            } else {
                alert("No student selected for deletion");
            }
        }

        function updateStudent() {
            if (studentName.value.trim() === '' || studentId.value.trim() === '' || course.value.trim() === '' || balance.value.trim() === '') {
                alert("All fields are required.");
                return;
            }

            if (selectedStudentId) {
                update(ref(db, 'Student/' + selectedStudentId), {
                    StudentName: studentName.value,
                    Course: course.value,
                    Balance: balance.value,
                    Email: email.value,

                })
                    .then(() => {
                        alert("Student Updated");
                        loadStudents(); // Refresh the data after updating the student
                        selectedStudentId = null; // Reset the selected student ID
                        clearForm(); // Clear the input fields
                        studentId.removeAttribute('readonly'); // Make student ID editable again
                    })
                    .catch((error) => {
                        console.error("Error updating student: ", error);
                    });
            } else {
                alert("No student selected for update");
            }
        }

        function selectRow(row, student) {
            const previouslySelected = document.querySelector('.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }
            row.classList.add('selected');
            selectedStudentId = student.StudentId;

            // Populate the input fields with the selected student's data
            studentName.value = student.StudentName;
            studentId.value = student.StudentId;
            course.value = student.Course;
            balance.value = student.Balance;
            email.value = student.Email;

            // Make the student ID field read-only
            studentId.setAttribute('readonly', true);
        }

        function clearForm() {
            studentName.value = '';
            studentId.value = '';
            course.value = '';
            balance.value = '';
            email.value = '';
            studentId.removeAttribute('readonly'); // Make student ID editable again
        }

        btnAdd.addEventListener('click', addStudent);
        btnDelete.addEventListener('click', deleteStudent);
        btnUpdate.addEventListener('click', updateStudent);
        btnClear.addEventListener('click', clearForm);

        // Load student data when the page loads
        // window.onload = () => {
        //     loadStudents();
        // };
        loadStudents();

    } else if (page === 'addItem.html') {
        const mealRadios = document.querySelectorAll('input[name="meal"]');
        const addItemBtn = document.getElementById('addItemBtn');
        const updateItemBtn = document.getElementById('updateItemBtn');
        const deleteItemBtn = document.getElementById('deleteItemBtn');
        let selectedItemKey = null;


        stopMainCamera();
        // stopCamera();

        // Function to load data based on selected meal type
        function loadData(mealType) {
            const dbRef = ref(db);
            get(child(dbRef, mealType)).then((snapshot) => {
                if (snapshot.exists()) {
                    const items = snapshot.val();
                    const itemsTableBody = document.getElementById('itemsTableBody');
                    itemsTableBody.innerHTML = ''; // Clear the table body

                    for (const key in items) {
                        if (items.hasOwnProperty(key)) {
                            const item = items[key];
                            const row = document.createElement('tr');
                            const itemNameCell = document.createElement('td');
                            const rateCell = document.createElement('td');

                            itemNameCell.textContent = item.ItemName;
                            rateCell.textContent = item.Rate;

                            row.appendChild(itemNameCell);
                            row.appendChild(rateCell);
                            row.dataset.key = key;

                            row.addEventListener('click', () => {
                                document.getElementById('itemName').value = item.ItemName;
                                document.getElementById('itemRate').value = item.Rate;
                                selectedItemKey = key;
                            });

                            itemsTableBody.appendChild(row);
                        }
                    }
                } else {
                    console.log("No data available");
                    const itemsTableBody = document.getElementById('itemsTableBody');
                    itemsTableBody.innerHTML = '<tr><td colspan="2">No data available</td></tr>';
                }
            }).catch((error) => {
                console.error("Error retrieving data: ", error);
            });
        }

        // Function to handle adding items
        function addItem() {
            const currentMealType = document.querySelector('input[name="meal"]:checked').value;
            const itemName = document.getElementById('itemName').value;
            const rate = document.getElementById('itemRate').value;

            set(ref(db, `${currentMealType}/${itemName}`), {
                ItemName: itemName,
                Rate: rate
            })
                .then(() => {
                    alert("Data Added");
                    loadData(currentMealType); // Refresh the data after adding a new item
                    document.getElementById('itemName').value = '';
                    document.getElementById('itemRate').value = '';
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }

        // Function to handle updating items
        function updateItem() {
            const currentMealType = document.querySelector('input[name="meal"]:checked').value;
            const itemName = document.getElementById('itemName').value;
            const rate = document.getElementById('itemRate').value;

            if (selectedItemKey) {
                update(ref(db, `${currentMealType}/${selectedItemKey}`), {
                    ItemName: itemName,
                    Rate: rate
                })
                    .then(() => {
                        alert("Data Updated");
                        loadData(currentMealType); // Refresh the data after updating the item
                        document.getElementById('itemName').value = '';
                        document.getElementById('itemRate').value = '';
                        selectedItemKey = null;
                    })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            } else {
                alert('Please select an item to update.');
            }
        }

        // Function to handle deleting items
        function deleteItem() {
            const currentMealType = document.querySelector('input[name="meal"]:checked').value;

            if (selectedItemKey) {
                remove(ref(db, `${currentMealType}/${selectedItemKey}`))
                    .then(() => {
                        alert("Data Deleted");
                        loadData(currentMealType); // Refresh the data after deleting the item
                        document.getElementById('itemName').value = '';
                        document.getElementById('itemRate').value = '';
                        selectedItemKey = null;
                    })
                    .catch((error) => {
                        console.error("Error deleting document: ", error);
                    });
            } else {
                alert('Please select an item to delete.');
            }
        }

        // Ensure elements are found before adding event listeners
        if (mealRadios) {
            mealRadios.forEach((radio) => {
                radio.addEventListener('change', () => {
                    const currentMealType = document.querySelector('input[name="meal"]:checked').value;
                    loadData(currentMealType); // Reload data when meal type changes
                });
            });
        }

        if (addItemBtn) {
            addItemBtn.addEventListener('click', addItem);
        }

        if (updateItemBtn) {
            updateItemBtn.addEventListener('click', updateItem);
        }

        if (deleteItemBtn) {
            deleteItemBtn.addEventListener('click', deleteItem);
        }

        // Load default data when the page loads
        const initialMealType = document.querySelector('input[name="meal"]:checked').value;
        loadData(initialMealType);
    } else if (page === 'billingpage.html') {
        // console.log("Billing page");
        stopMainCamera();
        const mealRadios = document.querySelectorAll('input[name="meal"]');
        const foodLists = document.querySelectorAll('.food-list');
        const totalPrice = document.getElementById('total-price');
        const studentIdInput = document.getElementById('student-id');
        const nextButton = document.getElementById('next-button');

        // Pop All

        const video = document.getElementById('video');


        document.getElementById('openPopup').addEventListener('click', function () {
            document.getElementById('popup').style.display = 'flex';
            startCamera();
        });

        document.querySelector('.close').addEventListener('click', function () {
            document.getElementById('popup').style.display = 'none';
            stopCamera();
        });

        document.querySelector('.closeButton').addEventListener('click', function () {
            document.getElementById('popup').style.display = 'none';
            stopCamera();
        });

        window.addEventListener('click', function (event) {
            if (event.target === document.getElementById('popup')) {
                document.getElementById('popup').style.display = 'none';
                stopCamera();
            }
        });

        const recognizeButton = document.getElementById('recognizeButton');
        var temp;
        var studentDetected = false;
        async function recognize() {
            console.log("Recognize function is called.");
            try {
                const response = await fetch('http://127.0.0.1:5000/recognize', { method: 'POST' });
                const data = await response.json();
                if (data.names.length > 0) {
                    studentDetected = true;
                    temp = data.names[0];
                    document.getElementById('result').textContent = "Student Id: " + temp.split('.')[0];
                    document.getElementById('showDetected').style.display = 'block';
                } else {
                    studentDetected = false;
                    alert("Student Not Detected");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        recognizeButton.addEventListener('click', recognize);

        document.getElementById('SelectButton').addEventListener('click', function () {
            console.log(temp);
            if (studentDetected) {
                studentIdInput.value = temp.split('.')[0];
                document.getElementById('popup').style.display = 'none';
                stopCamera();
            }
        });


        function startCamera() {
            video.src = 'image/gif_loading.gif';
            fetch('http://127.0.0.1:5000/start_camera')
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    video.src = 'http://127.0.0.1:5000/video_feed';
                })
                .catch(error => console.error('Error:', error));
        }

        function stopCamera() {
            document.getElementById('result').textContent = "";
            document.getElementById('showDetected').style.display = 'none';
            fetch('http://127.0.0.1:5000/stop_camera')
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    video.src = ''; // Clear the src to stop
                })
                .catch(error => console.error('Error:', error));
            // location.reload();
        }



        //End of Pop Up 


        function setvalues() {
            studentId = studentIdInput.value;
            // console.log(studentId);
        }

        nextButton.addEventListener('click', function(){
            setvalues();
            if(studentId !== ""){
                loadPage('paymentpage.html');
            }else{
                alert("Student Id Not Selected.");
            }
            
        });


        document.getElementById('breakfast-list').classList.add('show');
        fetchBreakfastItems();
        function handleMealChange(event) {
            const selectedMeal = event.target.value;
            foodLists.forEach(list => list.classList.remove('show'));
            document.getElementById(`${selectedMeal}-list`).classList.add('show');
            if (selectedMeal === 'breakfast') {
                fetchBreakfastItems();
            } else if (selectedMeal === 'lunch') {
                fetchLunchItems();
            } else if (selectedMeal === 'snacks') {
                fetchSnacksItems();
            } else if (selectedMeal === 'dinner') {
                fetchDinnerItems();
            }
            calculateMealTotal(selectedMeal);
        }

        function handleQuantityChange(event) {
            const quantity = parseInt(event.target.value) || 0;
            const foodItem = event.target.closest('.food-item');
            const price = parseFloat(foodItem.querySelector('td:nth-child(2)').innerText.replace('₹', ''));
            const total = quantity * price;
            foodItem.querySelector('td:nth-child(4) span').innerText = total.toFixed(2); // Remove ₹ sign here
            calculateMealTotal(foodItem.closest('.food-list').id.split('-')[0]);
        }

        function calculateMealTotal(selectedMeal) {
            let totalMealPrice = 0;
            const totalPriceElements = document.querySelectorAll(`#${selectedMeal}-list .total-price`);
            totalPriceElements.forEach(element => {
                totalMealPrice += parseFloat(element.innerText.replace('₹', ''));
            });
            // totalPriceInput.value = `₹${totalMealPrice.toFixed(2)}`;
            totalPrice.innerHTML = `₹${totalMealPrice.toFixed(2)}`;
            finalPrice = totalMealPrice;
        }

        mealRadios.forEach(radio => radio.addEventListener('change', handleMealChange));

        // Live Date and Time
        // function updateDateTime() {
        //     const now = new Date();
        //     const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        //     const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
        //     if(page === 'html/billingpage.html') document.getElementById('date-time').textContent = `${date} - ${time}`;
        //     else{
        //         console.log("Out");
        //     }
        // }
        let intervalId = null;
        function updateDateTime() {
            const dateTimeElement = document.getElementById('date-time');
            if (dateTimeElement) {
                const now = new Date();
                const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
                dateTimeElement.textContent = `${date} - ${time}`;
            } else {
                console.log("Element with ID 'date-time' not found");
                if (intervalId !== null) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }
            // setInterval(updateDateTime, 1000);
        }
        intervalId = setInterval(updateDateTime, 1000); // Update every second
        updateDateTime(); // Initial call to display immediately

        // Fetch Breakfast Items from Firebase
        function fetchBreakfastItems() {
            const breakfastRef = ref(db, 'Breakfast');
            get(breakfastRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const breakfastItems = snapshot.val();
                    const breakfastTableBody = document.getElementById('breakfast-items');
                    breakfastTableBody.innerHTML = ''; // Clear existing rows
                    for (const item in breakfastItems) {
                        const foodItem = breakfastItems[item];
                        const row = document.createElement('tr');
                        row.classList.add('food-item');
                        row.innerHTML = `
                                <td>${foodItem.ItemName}</td>
                                <td>₹${foodItem.Rate}</td>
                                <td><input type="number" class="quantity" min="0" value="0"></td>
                                <td>₹<span class="total-price">0.00</span></td>
                            `;
                        row.querySelector('.quantity').addEventListener('input', handleQuantityChange);
                        breakfastTableBody.appendChild(row);
                    }
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error('Error fetching breakfast items:', error);
            });
        }

        // Fetch Lunch Items from Firebase
        function fetchLunchItems() {
            const lunchRef = ref(db, 'Lunch');
            get(lunchRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const lunchItems = snapshot.val();
                    const lunchTableBody = document.getElementById('lunch-items');
                    lunchTableBody.innerHTML = ''; // Clear existing rows
                    for (const item in lunchItems) {
                        const foodItem = lunchItems[item];
                        const row = document.createElement('tr');
                        row.classList.add('food-item');
                        row.innerHTML = `
                                <td>${foodItem.ItemName}</td>
                                <td>₹${foodItem.Rate}</td>
                                <td><input type="number" class="quantity" min="0" value="0"></td>
                                <td>₹<span class="total-price">0.00</span></td>
                            `;
                        row.querySelector('.quantity').addEventListener('input', handleQuantityChange);
                        lunchTableBody.appendChild(row);
                    }
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error('Error fetching lunch items:', error);
            });
        }

        // Fetch Snacks Items from Firebase
        function fetchSnacksItems() {
            const snacksRef = ref(db, 'Snacks');
            get(snacksRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const snacksItems = snapshot.val();
                    const snacksTableBody = document.getElementById('snacks-items');
                    snacksTableBody.innerHTML = ''; // Clear existing rows
                    for (const item in snacksItems) {
                        const foodItem = snacksItems[item];
                        const row = document.createElement('tr');
                        row.classList.add('food-item');
                        row.innerHTML = `
                                <td>${foodItem.ItemName}</td>
                                <td>₹${foodItem.Rate}</td>
                                <td><input type="number" class="quantity" min="0" value="0"></td>
                                <td>₹<span class="total-price">0.00</span></td>
                            `;
                        row.querySelector('.quantity').addEventListener('input', handleQuantityChange);
                        snacksTableBody.appendChild(row);
                    }
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error('Error fetching snacks items:', error);
            });
        }

        // Fetch Dinner Items from Firebase
        function fetchDinnerItems() {
            const dinnerRef = ref(db, 'Dinner');
            get(dinnerRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const dinnerItems = snapshot.val();
                    const dinnerTableBody = document.getElementById('dinner-items');
                    dinnerTableBody.innerHTML = ''; // Clear existing rows
                    for (const item in dinnerItems) {
                        const foodItem = dinnerItems[item];
                        const row = document.createElement('tr');
                        row.classList.add('food-item');
                        row.innerHTML = `
                                <td>${foodItem.ItemName}</td>
                                <td>₹${foodItem.Rate}</td>  
                                <td><input type="number" class="quantity" min="0" value="0"></td>
                                <td>₹<span class="total-price">0.00</span></td>
                            `;
                        row.querySelector('.quantity').addEventListener('input', handleQuantityChange);
                        dinnerTableBody.appendChild(row);
                    }
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error('Error fetching dinner items:', error);
            });
        }
        // handleQuantityChange('Breakfast');
        // fetchBreakfastItems();
        // calculateMealTotal(selectedMeal);
    } else if (page === 'paymentpage.html') {
        // Payment Page
        // console.log(finalPrice);
        // console.log(studentId);
        stopMainCamera();

        const totalMealPriceInput = document.getElementById("total-price");
        const studentIdInput = document.getElementById('student-id');
        const studentNameInput = document.getElementById('student-name');
        const current_balance = document.getElementById('current-balance');
        const remaining_balance = document.getElementById('remaining-balance');
        const submitButton = document.getElementById('done-button');

        // function sendMessage(){

        // }



        const storage = getStorage(app);

        function displayImage(imageName, folderPath) {
            console.log("Getting Image UrL For " + imageName + " at " + folderPath);
            const imageRef = storageRef(storage, `${folderPath}/${imageName}`);

            getDownloadURL(imageRef)
                .then((url) => {
                    // Set the image source to the URL
                    document.getElementById('student-photo').src = url;
                    console.log("Url: " + url);
                })
                .catch((error) => {
                    console.error("Error fetching image: ", error);
                });
        }

        // displayImage(`${studentId + '.jpg'}`, 'captured_images');
        const studentIdTemp = studentId+'.jpg';
        console.log(studentIdTemp);
        displayImage(studentIdTemp, 'captured_images');


        (function () {
            emailjs.init("IG2yiqWemCzCaJU3k"); // Replace 'YOUR_USER_ID' with your EmailJS user ID

            submitButton.addEventListener('click', function (event) {

                const dbRef = ref(db);
                get(child(dbRef, 'Student/' + studentId)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();

                        const storedEmail = String(data.Email);
                        const storedName = String(data.StudentName);
                        const current_balance = String(data.Balance);
                        const remaining_balance = current_balance - finalPrice;
                        const courseName = String(data.Course);

                        if (true) {
                            event.preventDefault();
                            // Collect user inputs
                            //const userName = document.getElementById('user-name').value.trim();
                            const userName = 'RAMS Group';
                            // Prepare email parameters
                            const emailParams = {
                                from_name: userName,
                                to_name: 'Recipient_0111', // Change to the recipient's name if needed
                                //message_html: message,
                                reply_to: storedEmail,
                                student_Name: storedName,
                                student_Id: studentId,
                                billAmount: finalPrice,
                                currentBalance: current_balance,
                                remaining_Balance: remaining_balance
                            };

                            // Send email
                            emailjs.send('service_nyl10wr', 'template_ly8mobp', emailParams)
                                .then(function (response) {
                                    //   console.log('Email sent:', response);
                                    alert('Email sent successfully!');

                                    update(ref(db, 'Student/' + studentId), {
                                        StudentName: storedName,
                                        Course: courseName,
                                        Balance: remaining_balance,
                                        Email: storedEmail
                                    })
                                        .then(() => {
                                            alert("Student Updated");
                                        })
                                        .catch((error) => {
                                            console.error("Error updating student: ", error);
                                        });
                                }, function (error) {
                                    console.error('Error sending email:', error);
                                    alert('Failed to send email. Please try again later.');
                                });
                        }
                    } else {
                        alert("Student Not Exits");
                    }

                })
                    .catch((error) => {
                        alert("Unsuccessful");
                    })
            });
        })();



        totalMealPriceInput.value = `₹${finalPrice}`;
        studentIdInput.value = studentId;

        if (studentId !== "") {
            const dbRef = ref(db);

            get(child(dbRef, 'Student/' + studentId)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();

                    const totalBalance = String(data.Balance);
                    const student_name = String(data.StudentName);
                    current_balance.value = `₹${totalBalance}`;
                    remaining_balance.value = `₹${totalBalance - finalPrice}`;
                    studentNameInput.value = student_name;
                    console.log(totalBalance);
                } else {
                    alert("Student Not Exits");
                }

            })
                .catch((error) => {
                    alert("Unsuccessful");
                })
        }

    } else {
        // Handle other pages if needed
        // console.log('Setup for other pages');
    }
}



// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadPage('student.html'); // Load the default page
});

window.loadPage = loadPage; // Export loadPage function for use in inline onclick attributes
window.start_Camera = start_Camera;