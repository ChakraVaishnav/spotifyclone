let currentAudio = null; 
let currentButton = null;
let currentImage=null;
let currentIndex = -1; 
let isLooping = false; // Initialize looping variable
let isShuffle=false;

const playButtons = document.querySelectorAll(".fa-play");
const audios = document.querySelectorAll("audio");
const images=document.getElementsByClassName("Img");
const Fpbt = document.getElementById("Fpbt");
const Npbt = document.getElementById("nextBT");
const Ppbt = document.getElementById("prevBT");
const seekBar = document.querySelector('.seek-bar');
const currentTimeDisplay = document.querySelector('.current-time');
const totalDurationDisplay = document.querySelector('.total-duration');
const currentSongImg = document.getElementById('footerImg');  // Updated to select footer image
const loop = document.getElementById("loop"); // Loop button element
const shuffle=document.getElementById("shuffle");
const sidebar = document.querySelector('.sidebar');
const menuButton = document.querySelector('.fa-bars');
    
menuButton.onclick = function() {
     if (sidebar.style.left === '-250px' || sidebar.style.left === '') {
      sidebar.style.left = '0'; // Show sidebar
     } 
     else {
            sidebar.style.left = '-250px'; // Hide sidebar
       }
    };
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Load metadata for each audio element
audios.forEach((audio, index) => {
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        console.log(`Loaded metadata for audio ${index}`);
        console.log(`Duration for audio ${index}: ${formatTime(duration)}`);

        if (audio === currentAudio) {
            seekBar.max = duration;
            totalDurationDisplay.textContent = formatTime(duration);
        }
    });

    // Update the seek bar and current time display as the song plays
    audio.addEventListener('timeupdate', () => {
        if (audio && seekBar) {
            seekBar.value = audio.currentTime;
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }
    });
});

function toggleAudio(button, audio,image, index) {
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentButton.classList.replace('fa-pause', 'fa-play');
    }

    if (audio.paused) {
        audio.play();
        Fpbt.classList.replace('fa-circle-play', 'fa-circle-pause');
        button.classList.replace('fa-play', 'fa-pause');
        currentAudio = audio;
        currentButton = button;
        currentIndex = index;
        currentImage=image.src;
        currentSongImg.src=currentImage;
        seekBar.max = audio.duration;
        totalDurationDisplay.textContent = formatTime(audio.duration);
    } else {
        audio.pause();
        button.classList.replace('fa-pause', 'fa-play');
        Fpbt.classList.replace('fa-circle-pause', 'fa-circle-play');
    }
}

playButtons.forEach((button, index) => {
    button.addEventListener("click", () => toggleAudio(button, audios[index],images[index], index));

    audios[index].addEventListener('ended', () => {
        if (isLooping) {  // Check if looping is enabled
            currentAudio.currentTime = 0;
            currentAudio.play();
        }
        else if(isShuffle){
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * audios.length); // Generate a random index
            } while (randomIndex === currentIndex); // Ensure it's not the same as the current index
            
            currentIndex = randomIndex; // Update currentIndex to the new random index
            toggleAudio(playButtons[randomIndex], audios[randomIndex], images[randomIndex], randomIndex);
        }
        else if (index < audios.length - 1) {
            toggleAudio(playButtons[index + 1], audios[index + 1],images[index+1], index + 1);
        } 
        else{
            Fpbt.classList.replace('fa-circle-pause', 'fa-circle-play');
        }
    });
});

Fpbt.addEventListener('click', () => {
    if (currentAudio != null) {
        if (currentAudio.paused) {
            currentAudio.play();
            Fpbt.classList.replace('fa-circle-play', 'fa-circle-pause');
            currentButton.classList.replace('fa-play', 'fa-pause');
        } else {
            currentAudio.pause();
            Fpbt.classList.replace('fa-circle-pause', 'fa-circle-play');
            currentButton.classList.replace('fa-pause', 'fa-play');
        }
    }
});

Npbt.addEventListener('click', () => {
    if (currentAudio != null && currentIndex < audios.length - 1) {
        toggleAudio(playButtons[currentIndex + 1], audios[currentIndex + 1],images[currentIndex+1], currentIndex + 1);
    }
});

Ppbt.addEventListener('click', () => {
    if (currentAudio != null && currentIndex > 0) {
        toggleAudio(playButtons[currentIndex - 1], audios[currentIndex - 1],images[currentIndex-1], currentIndex - 1);
    }
});

// Seek bar functionality
seekBar.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.currentTime = seekBar.value;
        currentTimeDisplay.textContent = formatTime(seekBar.value);
    }
});

loop.addEventListener('click', () => {
    isLooping = !isLooping; // Toggle loop state
    loop.style.color = isLooping ? '#1db954' : 'whitesmoke';  // Change button color based on loop state
});
shuffle.addEventListener('click', () => {
    isShuffle = !isShuffle; // Toggle loop state
    shuffle.style.color = isShuffle ? '#1db954' : 'whitesmoke';  // Change button color based on loop state
});
