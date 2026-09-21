// Make footer invisible until the user clicks a button
document.querySelector('footer').classList.toggle('hidden');

// Youtube API stuff
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady(){

    // Responsive web developement
    if (screen.width < 500){
        player = new YT.Player('player', {
            height: '207',
            width: '340',
            videoId: 'dQw4w9WgXcQ',
            playerVars: {
                'autoplay': 1,
                'mute': 0,
                'playsinline': 1,
                'rel': 0,
                'controls': 0,
                'loop': 1,
            },
        });
    }
    else{
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'dQw4w9WgXcQ',
            playerVars: {
                'autoplay': 1,
                'mute': 0,
                'playsinline': 1,
                'rel': 0,
                'controls': 0,
                'loop': 1,
            },
        });
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }
}  
const troll = document.getElementById('troll');
const btns = document.querySelectorAll('.button');
const securityCheck = document.getElementById('security');
const footer = document.querySelector('footer');
const content = document.getElementById('content');

// Adding event listeners to all buttons, when one gets clicks, rick roll plays
btns.forEach((btn) => btn.addEventListener('click', playVideo));

function playVideo(){
    // Changing styles
    securityCheck.classList.toggle('hidden');
    troll.classList.toggle('hidden');
    troll.style.display = 'flex';
    content.style.paddingTop = '0';
    footer.classList.toggle('hidden');

    // Play video
    player.playVideo();
} 

// Initial fake loading screen
const fakeText = document.querySelector('.fake-robot-text');
const securityCheckContainer = document.querySelector('.security-check-container');
setTimeout(() => {
    fakeText.classList.toggle('hidden');
    securityCheckContainer.classList.toggle('hidden');
}, 3000);