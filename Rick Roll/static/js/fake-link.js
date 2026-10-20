// Make footer invisible until the user clicks a button
document.querySelector('footer').classList.toggle('hidden');
const playerDiv = document.getElementById('player');
// Youtube API stuff
const videoPlayer = document.createElement('video');
function makeVideo() {
    const rickSource = document.createElement('source');
    rickSource.src = "/static/video/Rick.mp4";
    videoPlayer.appendChild(rickSource);
    playerDiv.appendChild(videoPlayer);
    videoPlayer.preload = 'auto';
    
    if (screen.width < 450){
        videoPlayer.width = 320;
        videoPlayer.height = 240;
    }
    else{
        videoPlayer.width = 640;
        videoPlayer.height = 390;
    }
}


const troll = document.getElementById('troll');
const btns = document.querySelectorAll('.button');
const securityCheck = document.getElementById('security');
const footer = document.querySelector('footer');
const content = document.getElementById('content');

// Adding event listeners to all buttons, when one gets clicks, rick roll plays
btns.forEach((btn) => btn.addEventListener('click', () => {
        const securityHeading = document.getElementById('security-check-heading');
        securityHeading.textContent = 'Loading';
        securityHeading.classList.toggle('fake-robot-text');
        playVideo();
    }
));
// Initial fake loading screen
const fakeText = document.querySelector('.fake-robot-text');
const securityCheckContainer = document.querySelector('.security-check-container');
setTimeout(() => {
    fakeText.classList.toggle('hidden');
    securityCheckContainer.classList.toggle('hidden');
}, 3000);