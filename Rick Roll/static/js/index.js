// Inputs
const titleInput = document.getElementById('id_title');
const descriptionInput = document.getElementById('id_description');
const imageInput = document.getElementById('id_image');

// Display values
const titleDisplay = document.getElementById('title-core');
const descriptionDisplay = document.getElementById('description-core');
const imageDisplay = document.getElementById('image-core');

titleInput.addEventListener('input', updateTitle);
descriptionInput.addEventListener('input', updateDescription);
imageInput.addEventListener('change', updateImage);

function updateTitle(){
    titleDisplay.innerText = titleInput.value;   
}

function updateDescription(){
    descriptionDisplay.innerText = descriptionInput.value;
}

function updateImage(){
    const reader = new FileReader();

    reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        imageDisplay.src = imageDataUrl;
    }

    reader.readAsDataURL(imageInput.files[0]);
}

// Getting new link and putting in local storage
let startingIndex = -3;
let endingIndex = 0;
const linkHistory = document.getElementById('link-history');
const newLinkElement = document.getElementById('new-link');
const newLink = newLinkElement ? newLinkElement.href : '';
const savedLinks = JSON.parse(localStorage.getItem('links')) || [];

function initializeLinks(){    
    // If the user creates a new link, add it to the local storage
    if (newLink){
        // Add it to local storage
        const linkData = {
            title: newLinkElement.dataset.title,
            description: newLinkElement.dataset.description,
            image: newLinkElement.dataset.image,
            code: newLinkElement.dataset.code,
            link: newLink,
        };

        savedLinks.unshift(linkData);
        localStorage.setItem('links', JSON.stringify(savedLinks));
    }
    
    // If the user has created links before
    if (savedLinks.length){
        linkHistory.innerHTML += `
            <table class="link-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Generated URL</th>
                        <th>View analytics</th>
                        <th>Copy URL</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>`;        
        
        // If there are more than 3 links, add a "View More" button
        if (savedLinks.length > 3){
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.innerText = 'View More';
            viewMoreBtn.classList.add('view-more-btn');
            linkHistory.appendChild(viewMoreBtn);

            viewMoreBtn.addEventListener('click', fetchMoreLinks);
        }

        fetchMoreLinks();

        // Event delegation, add event listener for the copy button clicks
        linkHistory.addEventListener('click', (event) => {
            if (event.target.classList.contains('copy-btn')){
                const linkToCopy = event.target.closest('tr').querySelector('a').href;
                navigator.clipboard.writeText(linkToCopy)
                    .then(() => {
                        alert('Link copied to clipboard!');
                    })
                    .catch((err) => {
                        console.error('Failed to copy link: ', err);
                    });
            }
        });
    }
    else{
        linkHistory.innerHTML += "Create a link to get started!"
    }
}


function createLinkRows(showMoreRow, startingIndex, endingIndex){
    const tableBody = document.querySelector('tbody');
    const linksToDisplay = savedLinks.slice(startingIndex, endingIndex);
    // Dangerous for XSS
    // for (const link of linksToDisplay){
    //     const row = 
    //     tableBody.innerHTML += `
    //         <tr class="${showMoreRow}">
    //             <td>${link.title}</td>
    //             <td>${link.description}</td>
    //             <td><img src="${link.image}" alt="${link.image != "None" ? link.title: 'no image attached'}" class="table-image"></td>
    //             <td><a href="${link.link}">${link.link}</a></td>
    //             <td><a href="/analytics/${link.code}"><button class="view-analytics-btn">View</button></a></td>
    //             <td><button class="copy-btn">Copy</button></td>
    //         </tr>
    //     `;
    // }
    for (const link of linksToDisplay) {
        const row = document.createElement('tr');
        row.className = showMoreRow;

        const titleCell = document.createElement('td');
        titleCell.textContent = link.title || '';

        const descCell = document.createElement('td');
        descCell.textContent = link.description || '';

        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = link.image || '';
        img.alt = link.title ? link.title : 'No image attached';
        img.className = 'table-image';
        imageCell.appendChild(img);

        const urlCell = document.createElement('td');
        const urlLink = document.createElement('a');
        urlLink.href = link.link || '#';
        urlLink.textContent = link.link || '';
        urlCell.appendChild(urlLink);

        const analyticsCell = document.createElement('td');
        const analyticsLink = document.createElement('a');
        analyticsLink.href = `/analytics/${link.code || ''}`;
        const button = document.createElement('button');
        button.className = 'view-analytics-btn';
        button.textContent = 'View';
        analyticsLink.appendChild(button);
        analyticsCell.appendChild(analyticsLink);

        const copyCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        copyCell.appendChild(copyButton);

        row.append(titleCell, descCell, imageCell, urlCell, analyticsCell, copyCell);
        tableBody.appendChild(row);
    }
}


function fetchMoreLinks(){
    startingIndex += 3;
    endingIndex += 3;
    const viewMoreBtn = document.querySelector('.view-more-btn');

    // Adjust based on what the button currently says
    if (viewMoreBtn){
        if (viewMoreBtn.textContent === "Show Fewer Links"){
            showFewerLinks();
            viewMoreBtn.textContent = "View More";
        }
        else{
            if (endingIndex >= savedLinks.length){
                viewMoreBtn.textContent = "Show Fewer Links";
            }
            if (startingIndex >= 3) {
                createLinkRows("show-more-rows", startingIndex, endingIndex);
            }
            else{
                createLinkRows("initial-rows", startingIndex, endingIndex);
            }
        }
    }
    else{
        createLinkRows("initial-rows", startingIndex, endingIndex);
    }

}


function showFewerLinks(){
    startingIndex = 0;
    endingIndex = 3;
    // Fetch all the links that came after the initial 3 and remove them from the table
    const rowsToRemove = document.querySelectorAll('.show-more-rows');
    rowsToRemove.forEach(row => row.remove());
}

// Initialize the links when the page loads
initializeLinks();

