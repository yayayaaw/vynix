// ======= Auto Scroll Hero Poster ========
const heroTrack = document.querySelector('.hero-track');

let scrollSpeed = 1;
function autoScroll() {
  if (heroTrack) {
    heroTrack.scrollLeft += scrollSpeed;
    if (
      heroTrack.scrollLeft + heroTrack.offsetWidth >= heroTrack.scrollWidth ||
      heroTrack.scrollLeft <= 0
    ) {
      scrollSpeed *= -1;
    }
  }
  requestAnimationFrame(autoScroll);
}
autoScroll();

// ======= Langganan Popup ========
const popup = document.querySelector('.popup');
const kodeInput = document.querySelector('#kodeLangganan');
const tombolValidasi = document.querySelector('#validasiKode');

tombolValidasi.addEventListener('click', () => {
  const kode = kodeInput.value.trim();
  const kodeValid = "VYNIX2025"; // Ganti dengan kode lo sendiri

  if (kode === kodeValid) {
    popup.style.display = "none";
  } else {
    alert("Kode salah, coba lagi!");
  }
});
