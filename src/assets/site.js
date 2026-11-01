// Bootstrap handles navigation and search; hover behavior is in geo.css.

// One load-based fade for every framed content photo, including lazy-loaded photos.
// No scroll observer, movement, or hidden state; images work without JavaScript.
(() => {
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
const images = document.querySelectorAll('img.common-image');
images.forEach(image => {
const fade = () => {
if (image.naturalWidth > 0) image.classList.add('is-loaded');
};
if (image.complete) fade();
else image.addEventListener('load', fade, { once: true });
});
})();
