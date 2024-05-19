
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// import { getDatabase,ref,child,get,set,update,remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// const firebaseConfig = {
//      apiKey: "AIzaSyDydurEKNLQIYsgenH29sWXJEgKCvdY-js",
//      authDomain: "ramsproject321-75e29.firebaseapp.com",
//      databaseURL: "https://ramsproject321-75e29-default-rtdb.firebaseio.com",
//      projectId: "ramsproject321-75e29",
//      storageBucket: "ramsproject321-75e29.appspot.com",
//      messagingSenderId: "400972635097",
//      appId: "1:400972635097:web:8d98ea2531849aabfd17c8",
//      measurementId: "G-WDY9Y6BL30"
// };





let mealsData = {
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
};

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemRate = document.getElementById('itemRate').value;
    const selectedMeal = document.querySelector('input[name="meal"]:checked');

    if (itemName && itemRate && selectedMeal) {
        const mealType = selectedMeal.value;

        // Add the new item to the corresponding meal data array
        mealsData[mealType].push({ name: itemName, rate: itemRate });

        // Reset the form
        document.getElementById('itemForm').reset();

        // Load the updated data into the table
        loadData();
    } else {
        alert('Please fill out both fields and select a meal type.');
    }
}

function updateItem() {
    const selectedItemIndex = document.getElementById('itemsTableBody').getAttribute('data-selected-index');

    if (selectedItemIndex !== null) {
        const itemName = document.getElementById('itemName').value;
        const itemRate = document.getElementById('itemRate').value;
        const selectedMeal = document.querySelector('input[name="meal"]:checked');

        if (itemName && itemRate && selectedMeal) {
            const mealType = selectedMeal.value;

            // Update the item in the corresponding meal data array
            mealsData[mealType][selectedItemIndex] = { name: itemName, rate: itemRate };

            // Reset the form
            document.getElementById('itemForm').reset();

            // Load the updated data into the table
            loadData();
        } else {
            alert('Please fill out both fields and select a meal type.');
        }
    } else {
        alert('Please select an item to update.');
    }
}

function deleteItem() {
    const selectedItemIndex = document.getElementById('itemsTableBody').getAttribute('data-selected-index');

    if (selectedItemIndex !== null) {
        const selectedMeal = document.querySelector('input[name="meal"]:checked');

        if (selectedMeal) {
            const mealType = selectedMeal.value;

            // Remove the item from the corresponding meal data array
            mealsData[mealType].splice(selectedItemIndex, 1);

            // Reset the form
            document.getElementById('itemForm').reset();

            // Load the updated data into the table
            loadData();
        }
    } else {
        alert('Please select an item to delete.');
    }
}

function loadData() {
    const selectedMeal = document.querySelector('input[name="meal"]:checked');
    if (selectedMeal) {
        const mealType = selectedMeal.value;
        const itemsTableBody = document.getElementById('itemsTableBody');

        // Clear the existing table data
        itemsTableBody.innerHTML = '';

        // Populate the table with the items for the selected meal
        mealsData[mealType].forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.name}</td><td>${item.rate}</td>`;
            row.addEventListener('click', () => {
                document.getElementById('itemName').value = item.name;
                document.getElementById('itemRate').value = item.rate;
                document.getElementById('itemsTableBody').setAttribute('data-selected-index', index.toString());
            });
            itemsTableBody.appendChild(row);
        });
    }
}
