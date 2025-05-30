let currentlyPlaying = null;

// Seek function
function seekToTime(songId, seconds) {
  const audio = document.getElementById(`audio-${songId}`);
  if (audio) {
    pauseAllSongs();

    audio.currentTime = seconds;
    audio.play();
    updatePlayButton(songId, true);
    currentlyPlaying = songId;
  }
}

const DEFAULT_VOLUME = 0.05; // 5%

// Set the volume for all audio
function setAllVolumes(volume) {
  const allAudio = document.querySelectorAll("audio");
  allAudio.forEach((audio) => {
    audio.volume = volume;
  });
}



// Pause shit
function pauseAllSongs() {
  const allAudio = document.querySelectorAll("audio");
  const allPlayButtons = document.querySelectorAll(".play-button");

  allAudio.forEach((audio) => {
    audio.pause();
  });

  allPlayButtons.forEach((button) => {
    button.innerHTML = "▶";
    button.classList.remove("playing");
  });

  currentlyPlaying = null;
}

// Play/Pause all songs
function togglePlay(songId) {
  const audio = document.getElementById(`audio-${songId}`);
  const isCurrentlyPlaying = currentlyPlaying === songId;

  if (isCurrentlyPlaying) {
    audio.pause();
    updatePlayButton(songId, false);
    currentlyPlaying = null;
  } else {
    pauseAllSongs();
    audio.play();
    updatePlayButton(songId, true);
    currentlyPlaying = songId;
  }
}

function updatePlayButton(songId, isPlaying) {
  const playButton = document.querySelector(
    `[data-song-id="${songId}"] .play-button`
  );
  if (playButton) {
    playButton.innerHTML = isPlaying ? "⏸︎" : "▶";
    playButton.classList.toggle("playing", isPlaying);
  }
}

function toggleDescription(songId) {
  const description = document.getElementById(`description-${songId}`);
  const button = document.querySelector(
    `[data-song-id="${songId}"] .expand-button`
  );

  if (description.classList.contains("expanded")) {
    description.classList.remove("expanded");
    button.textContent = "Show Details ▼";
  } else {
    description.classList.add("expanded");
    button.textContent = "Hide Details ▲";
  }
}

// time formatting i stole
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// progress bars
function updateProgress(songId) {
  const audio = document.getElementById(`audio-${songId}`);
  const progressFill = document.querySelector(
    `[data-song-id="${songId}"] .progress-fill`
  );
  const currentTimeSpan = document.querySelector(
    `[data-song-id="${songId}"] .current-time`
  );
  const durationSpan = document.querySelector(
    `[data-song-id="${songId}"] .duration`
  );

  if (audio && progressFill && currentTimeSpan && durationSpan) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = formatTime(audio.duration);
  }
}

function handleProgressClick(event, songId) {
  const progressBar = event.currentTarget;
  const audio = document.getElementById(`audio-${songId}`);
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const percentage = clickX / width;
  const newTime = percentage * audio.duration;

  seekToTime(songId, newTime);
}

document.addEventListener("DOMContentLoaded", function () {
  const allAudio = document.querySelectorAll("audio");

  setAllVolumes(DEFAULT_VOLUME);

  allAudio.forEach((audio) => {
    const songId = audio.id.replace("audio-", "");
    const progressContainer = document.getElementById(`progress-${songId}`);


    audio.addEventListener("timeupdate", () => {
      updateProgress(songId);
    });

    audio.addEventListener("ended", () => {
      updatePlayButton(songId, false);
      currentlyPlaying = null;
    });

    audio.addEventListener("loadedmetadata", () => {
      const durationSpan = document.querySelector(
        `[data-song-id="${songId}"] .duration`
      );
      if (durationSpan) {
        durationSpan.textContent = formatTime(audio.duration);
      }
    });
  });
});
