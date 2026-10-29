// GEO v1: Bootstrap handles mobile navigation and mobile search.
// Desktop hover behavior is in geo.css; keyboard/touch also work through Bootstrap.

// Shared reveal for images carrying the image-reveal class.
(() => {
if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
const images = document.querySelectorAll('.image-reveal');
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (!entry.isIntersecting) return;
const image = entry.target;
observer.unobserve(image);
const reveal = () => {
if (image.naturalWidth > 0) image.classList.add('is-revealing');
};
if (image.complete) reveal();
else image.addEventListener('load', reveal, { once: true });
});
}, { threshold: 0.1 });
images.forEach(image => observer.observe(image));
})();
