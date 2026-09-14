const scenes = [...document.querySelectorAll('.scene')];
const sectionLinks = [...document.querySelectorAll('.scene-nav a')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const video = document.querySelector('.hero-video');
const toggle = document.querySelector('.motion-toggle');
let paused = reduceMotion.matches;
let heroVisible = true;
function syncMotion() {
  document.body.classList.toggle('motion-paused', paused);
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'Play ambient animation' : 'Pause ambient animation');
  toggle.title = toggle.getAttribute('aria-label');
  toggle.textContent = paused ? '▷' : 'Ⅱ';
  if (video.getAttribute('src')) {
    if (paused || !heroVisible || document.hidden) video.pause();
    else video.play().catch(() => {});
  }
}
toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
reduceMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
if (video.dataset.src) {
  video.src = video.dataset.src;
  video.addEventListener('playing', () => video.closest('.hero').classList.add('video-ready'));
  video.addEventListener('error', () => video.closest('.hero').classList.remove('video-ready'));
}
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.target.id === 'home') { heroVisible = entry.isIntersecting; syncMotion(); }
  }
  const active = scenes.reduce((best, scene) => {
    const rect = scene.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
    return visible > best.visible ? { scene, visible } : best;
  }, { scene: scenes[0], visible: 0 }).scene;
  document.body.dataset.scene = active.id;
  sectionLinks.forEach(link => {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { threshold: [0, .15, .3, .5, .7, 1] });
scenes.forEach(scene => observer.observe(scene));
document.getElementById('year').textContent = new Date().getFullYear();
syncMotion();
