// ==== DONASI ====
const donateBtn = document.getElementById('donateBtn');
const donateModal = document.getElementById('donateModal');
const closeDonateBtn = document.getElementById('closeDonate');
const quickAmounts = document.querySelectorAll('.quick-amount');
const amountInput = document.getElementById('amount');

donateBtn.addEventListener('click', () => {
  donateModal.style.display = 'flex';
});

closeDonateBtn.addEventListener('click', () => {
  donateModal.style.display = 'none';
});

quickAmounts.forEach(button => {
  button.addEventListener('click', () => {
    const amount = button.getAttribute('data-amount');
    amountInput.value = amount;
  });
});

// ==== VIDEO PLAYER ====
const movieCards = document.querySelectorAll('.movie-card');
const videoModal = document.getElementById('videoModal');
const closeVideoBtn = document.getElementById('closeVideo');

movieCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.getAttribute('data-title') || 'Film AI';
    const videoUrl = card.getAttribute('data-video');

    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `
      <h2>${title}</h2>
      <video controls autoplay style="width:100%; border-radius:10px;">
        <source src="${videoUrl}" type="video/mp4">
        Browser tidak mendukung video.
      </video>
    `;

    videoModal.style.display = 'flex';
  });
});

closeVideoBtn.addEventListener('click', () => {
  const videoContainer = document.getElementById('videoContainer');
  videoContainer.innerHTML = `
    <div class="video-placeholder">
      <div class="play-button">▶️</div>
      <p>Klik film untuk menonton</p>
    </div>
  `;
  videoModal.style.display = 'none';
});
