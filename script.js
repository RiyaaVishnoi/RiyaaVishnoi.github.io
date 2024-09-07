//create an array of images and their corresponding text
const images = [
    {
        src: 'Assignment1/Assets/js img1.jpg',
        text: 'Explore New Zealand!'
    }, 
    {
        src: 'Assignment1/Assets/img 2 js.jpg',
        text: 'Explore New Zealand!' 
    },
    {
        src: 'Assignment1/Assets/img js3.jpg',
        text: 'Explore New Zealand!'
    },
    {
        src: 'Assignment1/Assets/www.greatjourneysnz.com.jpg',
        text: 'Explore New Zealand!'
    }

]

let currentImgIndex = 0; //tracks the current image being displayed
const adContainer = document.getElementById('ad-container');
const adText = document.getElementById('ad-text');
const replayBtn = document.getElementById('replay-button');

function displayAd(imageIndex) {
    const currentImg = adContainer.querySelector('.ad-image.active'); //find the current active image and make it invisible
    if (currentImg) {
        currentImg.classList.remove('active');
    }

    const newImg = document.getElementById(`ad-image-${imageIndex + 1}`); // activate a new image
    newImg.classList.add('active');

}

function startAd() {
    displayAd(currentImgIndex);
    currentImgIndex++; //increment to move to next image
    if (currentImgIndex >= images.length) {
        clearInterval(adInterval);

    }
}

//call startad() every 3 seconds
let adInterval = setInterval(startAd,3000);

replayBtn.addEventListener('click', () => {
    clearInterval(adInterval); //stop current ad rotation
    currentImgIndex = 0; //reset to first ad
    startAd(); //display add
    adInterval = setInterval(startAd,3000); //reset new intercal
});

startAd();

// This part is for the ticket booking system
const formPage1 = document.getElementById("form-page1");
const formPage2 = document.getElementById("form-page2");
const formPage3 = document.getElementById("form-page3");
const formPage4 = document.getElementById("form-page4");
const formPage5 = document.getElementById("form-page5");
const formPage6 = document.getElementById("form-page6");
const progressBar = document.querySelector("progress");

const summaryName = document.getElementById("summary-name");
const summaryEmail = document.getElementById("summary-email");
const summaryAdults = document.getElementById("summary-adults");
const summaryChild = document.getElementById("summary-child");
const summaryStorage = document.getElementById("summary-storage");
const summaryColor = document.getElementById("summary-ticketColor");
const summaryDate = document.getElementById("summary-date");


const formData = document.getElementById("collected-data");

function showPage(pageNumber) {
    switch(pageNumber) {
        case 1:
            formPage1.style.display = 'block';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            formPage6.style.display = 'none';
            progressBar.value = 10;
            break;
        case 2:
            formPage1.style.display = 'none';
            formPage2.style.display = 'block';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            formPage6.style.display = 'none';
            progressBar.value = 30;
            break;
        case 3: 
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'block';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            formPage6.style.display = 'none';
            progressBar.value = 50;
            break;
        case 4: 
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'block';
            formPage5.style.display = 'none';
            formPage6.style.display = 'none';
            progressBar.value = 80;
            updateSummary();
            break;
        case 5:
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'block';
            formPage6.style.display = 'none';
            progressBar.value = 100;
            updateSummary();
            break;
        case 6:
            formPage1.style.display = 'none';
            formPage2.style.display = 'none';
            formPage3.style.display = 'none';
            formPage4.style.display = 'none';
            formPage5.style.display = 'none';
            formPage6.style.display = 'block';
            progressBar.value = 100;
            showTicket();
            break;
        default: 
            break;
    }
}

function getFormData() {
//get all input values that user gives us
    const Name = document.getElementById("contactName").value;
    const Email = document.getElementById("Personal-email").value;
    const date = document.getElementById("attendance-date").value;
    const numAdults = document.getElementById("number-Adults").value;
    const numChild = document.getElementById("number-Children").value;
    const color = document.getElementById("ticketcolor").value;

    const storage = formPage3.querySelector('input[name=optional]:checked').value;

    return data = {
        name: Name,
        email: Email,
        date:date,
        adults:numAdults,
        child:numChild,
        color:color,
        storage:storage
    };

}

function updateSummary() {

    //Set all the data
    const data = getFormData();
    summaryName.innerHTML = data.name;
    summaryAdults.innerHTML = data.adults;
    summaryChild.innerHTML = data.child;
    summaryColor.innerHTML = data.color;
    summaryDate.innerHTML = data.date,
    summaryStorage.innerHTML = data.storage;
    summaryEmail.innerHTML = data.email;
    
}


function showTicket() {
    const ticketSection = document.getElementById('ticket-section');

    // Get form data to display in the ticket
    const data = getFormData();

    // Populate ticket details with the form data
    document.getElementById('ticket-name').innerText = data.name;
    document.getElementById('ticket-email').innerText = data.email;
    document.getElementById('ticket-date').innerText = data.date;
    document.getElementById('ticket-adults').innerText = data.adults;
    document.getElementById('ticket-child').innerText = data.child;
    document.getElementById('ticket-color').innerText = data.color;
    document.getElementById('ticket-storage').innerText = data.storage;

    // Show the ticket section
    formPage1.style.display = 'none'; // hide the entire form
    ticketSection.style.display = 'block';
}
//Personal print function to only print the ticket and not the whole website
function printTicket() {
    // Get the ticket element you want to print
    const ticketContent = document.getElementById('ticket').innerHTML;
    
    // Open a new window
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Write the content to the new window
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Ticket</title>
            <style>
                /* Add any specific styles for the print view if needed */
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                h3 {
                    margin-top: 0;
                }
            </style>
        </head>
        <body>
            ${ticketContent}
        </body>
        </html>
    `);
    
    // Close the document to finish loading the content
    printWindow.document.close();
    
    // Wait for the content to be fully loaded, then trigger the print dialog
    printWindow.onload = function () {
        printWindow.focus(); // Ensure the print window is in focus
        printWindow.print(); // Trigger the print dialog
        printWindow.close(); // Close the window after printing
    };
}

