//Function to load data

function loadXMLData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "reserved-areas.xml",true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) 
        {
            // Parse the XML
            const xmlDoc = xhr.responseXML;
            const areas = xmlDoc.getElementsByTagName("area");

            for (let i = 0; i< areas.length;i++) {
                const id = areas[i].getAttribute("id");
                const capacity = areas[i].getElementsByTagName("capacity")[0].textContent;
                const cost = areas[i].getElementsByTagName("cost")[0].textContent;
                const booked = areas[i].getElementsByTagName("booked")[0].textContent === "true";
                const image = areas[i].getElementsByTagName("image")[0].textContent;
                    //get the div for the area
                const areaDiv = document.getElementById(`area${id}`);

                // Update the area div with the data
                if (booked) {
                    areaDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Red if booked
                    areaDiv.style.cursor = "not-allowed"; // Not clickable
                } else {
                    areaDiv.style.backgroundColor = "rgba(0, 255, 0, 0.2)"; // Green if available
                }

                // Add mouseover event to show details
                areaDiv.addEventListener("mouseover", function () {
                    showPopup(id, capacity, cost, booked, image);
                });

                // Add click event to book if available
                if (!booked) {
                    areaDiv.addEventListener("click", function () {
                        bookArea(id, capacity, cost);
                    });
                }


            }
        
        }

    };
    xhr.send();

}

//function to hide pop up with details
function removePopup() {
    const popup = document.querySelector('.popup'); // Find the popup
    if (popup) {
        popup.parentNode.removeChild(popup); // Remove only if it exists
    }
}

// Function to show a popup with area details
function showPopup(id, capacity, cost, booked, image) {
    // Remove any existing popup before showing a new one
    removePopup();

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <h3>Area ${id}</h3>
        <p>Capacity: ${capacity}</p>
        <p>Cost per day: $${cost}</p>
        <p>Booked: ${booked ? "Yes" : "No"}</p>
        <img src="${image}" alt="Area ${id} image" width="100">
    `;
    document.body.appendChild(popup);

    // Position the popup near the mouse
    const positionPopup = (e) => {
        popup.style.top = e.clientY + 10 + "px"; // Offset by 10px to avoid covering cursor
        popup.style.left = e.clientX + 10 + "px";
    };

    window.addEventListener("mousemove", positionPopup);

    // Remove the popup and the mousemove event listener when mouse leaves the area
    const area = document.getElementById(`area${id}`);
    area.addEventListener("mouseleave", function () {
        removePopup();
        window.removeEventListener("mousemove", positionPopup); // Clean up event listener
    });
}

//booking functionality
function bookArea(id, capacity, costPerDay) {
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const cap = document.getElementById("capacity").value;
    const today = new Date().setHours(0, 0, 0, 0); // Current date without time for comparison

    // Validate that check-in and check-out are not in the past
    if (new Date(checkIn) < today) {
        alert("Check-in date cannot be in the past.");
        return;
    }
    if (new Date(checkOut) < today) {
        alert("Check-out date cannot be in the past.");
        return;
    }
    // Validate that check-out is after check-in
    if (new Date(checkOut) <= new Date(checkIn)) {
        alert("Check-out date must be after check-in date.");
        return;
    }
    // Check for Capacity
    if (cap > capacity) {
        alert("You cannot book more people than the area capacity");
        return;
    }
    // Calculate the total number of days
    const totalDays = calculateDays(checkIn, checkOut);

    // Calculate the total cost
    const totalCost = totalDays * costPerDay;

    // Display booking confirmation and total cost
    alert(`You have booked Area ${id} for ${totalDays} days. Total cost: $${totalCost}`);

    // Populate the booking summary with details
    document.getElementById("modalCheckIn").textContent = checkIn;
    document.getElementById("modalCheckOut").textContent = checkOut;
    document.getElementById("modalCapacity").textContent = cap;
    document.getElementById("modalMaxCapacity").textContent = capacity;
    document.getElementById("modalDays").textContent = totalDays;
    document.getElementById("modalCostPerDay").textContent = costPerDay;
    document.getElementById("modalTotalCost").textContent = totalCost;

    // Show the booking summary
    showBookingSummary(checkIn, checkOut, cap, capacity, costPerDay);
}


// Function to calculate the difference between two dates in days
function calculateDays(checkIn, checkOut) {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);  // Difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));  // Convert milliseconds to days , Formula Taken from Internet
    return diffDays;
}

// Function to confirm booking
function confirmBooking() {
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;

    // Validate that check-out is after check-in
    if (new Date(checkOut) <= new Date(checkIn)) {
        alert("Check-out date must be after check-in date.");
        return;
    }
    alert("Your Booking has been confirmed");

    document.getElementById("bookingModal").style.display = "none";

    
}
// Get modal element and close button
var modal = document.getElementById("bookingModal");
var closeBtn = document.getElementsByClassName("close")[0];

// Show modal with booking summary
function showBookingSummary(checkIn, checkOut, capacity, maxCapacity, costPerDay) {
    // Calculate the total number of days
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    costPerDay = parseFloat(costPerDay);

    // Set values in the modal
    document.getElementById('modalCheckIn').innerText = checkIn;
    document.getElementById('modalCheckOut').innerText = checkOut;
    document.getElementById('modalCapacity').innerText = capacity;
    document.getElementById('modalMaxCapacity').innerText = maxCapacity;
    document.getElementById('modalDays').innerText = diffDays;
    document.getElementById('modalCostPerDay').innerText = costPerDay;
    document.getElementById('modalTotalCost').innerText = diffDays * costPerDay;

    // Show the modal
    modal.style.display = "block";
}

// Close modal
function closeModal() {
    modal.style.display = "none";
}

// Close modal when the user clicks on the "x"
closeBtn.onclick = function() {
    closeModal();
}

// Close modal when clicking outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

//follows the same code as loadxml but with specific checking for capacity

function CheckCapacity() {
    const desiredCapacity = document.getElementById("capacity").value;

    // Reload the XML data to recheck the capacity for all areas
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "reserved-areas.xml", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xmlDoc = xhr.responseXML;
            const areas = xmlDoc.getElementsByTagName("area");

            for (let i = 0; i < areas.length; i++) {
                const id = areas[i].getAttribute("id");
                const capacity = areas[i].getElementsByTagName("capacity")[0].textContent;
                const booked = areas[i].getElementsByTagName("booked")[0].textContent === "true";
                const image = areas[i].getElementsByTagName("image")[0].textContent; // Get the image data
                const cost = areas[i].getElementsByTagName("cost")[0].textContent;

                // Get the area div
                const areaDiv = document.getElementById(`area${id}`);

                // Check if the capacity is less than the desired capacity
                if (parseInt(capacity) < parseInt(desiredCapacity)) {
                    // If below the desired capacity, block the area (red and non-clickable)
                    areaDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
                    areaDiv.style.cursor = "not-allowed";
                    // Remove event listeners to prevent mouseover and click
                    areaDiv.removeEventListener("mouseover", function () {
                        showPopup(id, capacity, cost,booked, image); // Update with image
                    });
                    areaDiv.removeEventListener("click", function () {
                        bookArea(id, capacity,cost);
                    });
                } else if (!booked) {
                    // If the capacity meets the requirement and it's not booked, make it available (green)
                    areaDiv.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
                    areaDiv.style.cursor = "pointer";
                    
                    // Add event listeners for mouseover and click if not booked
                    areaDiv.addEventListener("mouseover", function () {
                        showPopup(id, capacity, cost, booked,image); // Update with image
                    });
                    areaDiv.addEventListener("click", function () {
                        bookArea(id, capacity,cost);
                    });
                }
            }
        }
    };
    xhr.send();
}
// Call the function to load the XML data when the page loads
window.onload = function () {
    loadXMLData();

    const checkInInput = document.getElementById("checkIn");
    const checkOutInput = document.getElementById("checkOut");

    // Get todays date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to one day after checkin

    // Format the dates as YYYY-MM-DD for the input fields
    const formattedToday = today.toISOString().split('T')[0];
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];

    // Set the default values
    checkInInput.value = formattedToday;
    checkOutInput.value = formattedTomorrow;
};

