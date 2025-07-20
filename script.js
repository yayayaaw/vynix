function playVideo(videoUrl, title) {
    const playerSection = document.getElementById('player');
    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');

    videoPlayer.src = videoUrl;
    videoTitle.textContent = title;
    playerSection.classList.remove('hidden');
    videoPlayer.play();
}

function closePlayer() {
    const playerSection = document.getElementById('player');
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.pause();
    videoPlayer.src = '';
    playerSection.classList.add('hidden');
}
