let currentAudio = null; 
let currentButton = null;
let currentIndex = -1; 

const playButtons = document.querySelectorAll(".fa-play");
const audios = document.querySelectorAll("audio");
const Fpbt = document.getElementById("Fpbt");
const Npbt = document.getElementById("nextBT");
const Ppbt = document.getElementById("prevBT");
const seekBar = document.querySelector('.seek-bar');
const currentTimeDisplay = document.querySelector('.current-time');
const totalDurationDisplay = document.querySelector('.total-duration');
const currentSongImg = document.getElementById('footerImg');  // Updated to select footer image

// Array storing paths to the images corresponding to each song
const songImages = [
    "images/s1PR.jpeg",  // Image for first song
    "images/s2PR.jpeg",  // Image for second song
    "images/s3PR.jpeg",  // Image for third song
    "images/s4PR.jpeg",
    "images/s5PR.jpeg",
    "images/s6PR.jpeg",
    "images/s7PR.jpeg",
    "images/s8PR.jpeg",
    "images/s9PR.jpeg",
    "images/s10PR.jpeg",
    "images/s11PR.jpeg",
    "images/s12PR.jpeg"
];

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

function toggleAudio(button, audio, index) {
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

        // Update song image in the footer when playing a new song
        if (songImages[index]) {
            currentSongImg.src = songImages[index];  // Updates the <img> tag's source in footer
        } else {
            console.log("No image found for index " + index);
        }

        seekBar.max = audio.duration;
        totalDurationDisplay.textContent = formatTime(audio.duration);
    } else {
        audio.pause();
        button.classList.replace('fa-pause', 'fa-play');
        Fpbt.classList.replace('fa-circle-pause', 'fa-circle-play');
    }
}

playButtons.forEach((button, index) => {
    button.addEventListener("click", () => toggleAudio(button, audios[index], index));

    audios[index].addEventListener('ended', () => {
        if (index < audios.length - 1) {
            toggleAudio(playButtons[index + 1], audios[index + 1], index + 1);
        } else {
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
        toggleAudio(playButtons[currentIndex + 1], audios[currentIndex + 1], currentIndex + 1);
    }
});

Ppbt.addEventListener('click', () => {
    if (currentAudio != null && currentIndex > 0) {
        toggleAudio(playButtons[currentIndex - 1], audios[currentIndex - 1], currentIndex - 1);
    }
});

// Seek bar functionality
seekBar.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.currentTime = seekBar.value;
        currentTimeDisplay.textContent = formatTime(seekBar.value);
    }
});
