
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
      loadPage(event.target.textContent.trim().toLowerCase()); // Extract link text and convert to lowercase
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
    if (page === 'addItem.html') {
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
    } else {
        // Handle other pages if needed
        console.log('Setup for other pages');
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadPage('student.html'); // Load the default page
});

window.loadPage = loadPage; // Export loadPage function for use in inline onclick attributes
