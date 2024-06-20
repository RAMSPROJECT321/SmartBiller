
import { db } from './firebase-config.js';
import { ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


// Add event listener to the navigation list (ul)
document.querySelector('nav ul').addEventListener('click', function(event) {
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

// Function to setup event listeners for dynamically loaded content
function setupPage(page) {
    if(page === 'html/student.html'){
        console.log("StudentPage");

        let selectedStudentId = null;

        const studentName = document.getElementById('studentName');
        const studentId = document.getElementById('studentId');
        const course = document.getElementById('course');
        const balance = document.getElementById('balance');
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

                            studentNameCell.textContent = student.StudentName;
                            studentIdCell.textContent = student.StudentId;
                            courseCell.textContent = student.Course;
                            balanceCell.textContent = student.Balance;

                            row.appendChild(studentNameCell);
                            row.appendChild(studentIdCell);
                            row.appendChild(courseCell);
                            row.appendChild(balanceCell);
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

        function addStudent() {
            if (studentName.value.trim() === '' || studentId.value.trim() === '' || course.value.trim() === '' || balance.value.trim() === '') {
                alert("All fields are required.");
                return;
            }

            const studentIdValue = studentId.value;
            const dbRef = ref(db, 'Student/' + studentIdValue);

            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    alert("Student with this ID already exists");
                } else {
                    set(dbRef, {
                        StudentName: studentName.value,
                        StudentId: studentIdValue,
                        Course: course.value,
                        Balance: balance.value
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
                    Balance: balance.value
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

            // Make the student ID field read-only
            studentId.setAttribute('readonly', true);
        }

        function clearForm() {
            studentName.value = '';
            studentId.value = '';
            course.value = '';
            balance.value = '';
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
        
    }else if (page === 'html/addItem.html') {
        const mealRadios = document.querySelectorAll('input[name="meal"]');
        const addItemBtn = document.getElementById('addItemBtn');
        const updateItemBtn = document.getElementById('updateItemBtn');
        const deleteItemBtn = document.getElementById('deleteItemBtn');
        let selectedItemKey = null;

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
    }else if(page === 'html/billingpage.html'){
        console.log("Billing page");
    
            const mealRadios = document.querySelectorAll('input[name="meal"]');
            const foodLists = document.querySelectorAll('.food-list');
            const totalPriceInput = document.getElementById('total-price');

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
                totalPriceInput.value = `₹${totalMealPrice.toFixed(2)}`;
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
    } else {
        // Handle other pages if needed
        console.log('Setup for other pages');
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadPage('html/student.html'); // Load the default page
});

window.loadPage = loadPage; // Export loadPage function for use in inline onclick attributes
