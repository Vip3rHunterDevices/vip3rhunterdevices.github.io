const wrapper = document.getElementById('review-wrapper');
const carousel = document.getElementById('review-carousel');

let isDragging = false;
let startX;
let scrollLeft;

// --- Mouse drag ---
wrapper.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - wrapper.offsetLeft;
  scrollLeft = wrapper.scrollLeft;
  stopAutoScroll();
});
wrapper.addEventListener('mouseup', endDrag);
wrapper.addEventListener('mouseleave', endDrag);
wrapper.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - wrapper.offsetLeft;
  const walk = (x - startX) * 1.5;
  wrapper.scrollLeft = scrollLeft - walk;
});

function endDrag() {
  if (isDragging) {
    isDragging = false;
    startAutoScrollDelayed();
  }
}

// --- Touch drag ---
let touchStartX = 0;
let touchScrollLeft = 0;
wrapper.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].pageX;
  touchScrollLeft = wrapper.scrollLeft;
  stopAutoScroll();
});
wrapper.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX;
  const walk = (x - touchStartX) * 1.5;
  wrapper.scrollLeft = touchScrollLeft - walk;
});
wrapper.addEventListener('touchend', startAutoScrollDelayed);

// --- Wheel horizontal scroll (no vertical scroll) ---
wrapper.addEventListener('wheel', (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    wrapper.scrollLeft += e.deltaY;
    stopAutoScroll();
    startAutoScrollDelayed();
  }
}, { passive: false });

// --- Auto-scroll logic ---
let autoScroll;
let autoScrollPaused = false;

function startAutoScroll() {
  if (autoScrollPaused) return;
  stopAutoScroll(); // clear any old one
  autoScroll = setInterval(() => {
    wrapper.scrollLeft += 1;
    if (wrapper.scrollLeft >= carousel.scrollWidth - wrapper.clientWidth) {
      wrapper.scrollLeft = 0;
    }
  }, 16); // ~60fps
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

function startAutoScrollDelayed(delay = 1500) {
  stopAutoScroll();
  autoScrollPaused = true;
  setTimeout(() => {
    autoScrollPaused = false;
    startAutoScroll();
  }, delay);
}

// Start on load
window.addEventListener("DOMContentLoaded", startAutoScroll);