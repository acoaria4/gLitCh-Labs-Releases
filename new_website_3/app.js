(function () {
  const TOTAL_SOURCE_FRAMES = 300;
  const END_HOLD_FRAMES = 50; // Provides a comfortable hold padding phase at the end of the scroll sequence
  const TOTAL_VIRTUAL_FRAMES = TOTAL_SOURCE_FRAMES + END_HOLD_FRAMES;
  const FOLDER_PATH = './ezgif-8e8488e4e01b4207-jpg/';
  
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  const progressBar = document.getElementById('progress-bar');

  const images = [];
  let loadedCount = 0;

  // Frame interpolation tracking
  let currentFrame = 0;
  let targetFrame = 0;

  // Helper to format frame filename: ezgif-frame-001.jpg ... ezgif-frame-300.jpg
  function getFrameUrl(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `${FOLDER_PATH}ezgif-frame-${frameNum}.jpg`;
  }

  // Preload all 300 images into memory
  function preloadImages() {
    for (let i = 0; i < TOTAL_SOURCE_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      
      const onImageLoad = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_SOURCE_FRAMES) * 100);
        loaderText.textContent = `Loading ${percent}%`;
        progressBar.style.width = `${percent}%`;

        if (loadedCount === TOTAL_SOURCE_FRAMES) {
          onAllImagesLoaded();
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Continue gracefully if any error occurs
      images.push(img);
    }
  }

  function onAllImagesLoaded() {
    // Hide loader overlay
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 200);

    // Initial canvas sizing and first render
    resizeCanvas();
    updateTargetFrame();
    currentFrame = targetFrame;
    renderFrame(currentFrame);

    // Start render loop
    requestAnimationFrame(renderLoop);
  }

  // Calculate target frame index based on window scroll position
  function updateTargetFrame() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
    targetFrame = scrollFraction * (TOTAL_VIRTUAL_FRAMES - 1);
  }

  window.addEventListener('scroll', updateTargetFrame, { passive: true });

  // Canvas cover scaling algorithm (similar to CSS object-fit: cover)
  function renderFrame(virtualIndex) {
    // Map virtual frame index to source image array index (clamped to final frame 299)
    const sourceIndex = Math.min(TOTAL_SOURCE_FRAMES - 1, Math.max(0, Math.round(virtualIndex)));
    const img = images[sourceIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 1280;
    const imgHeight = img.naturalHeight || 720;

    // Determine scale ratio to fill canvas viewport
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Handle window resizing with Device Pixel Ratio support
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Draw current frame immediately on resize
    renderFrame(currentFrame);
  }

  window.addEventListener('resize', resizeCanvas);

  // Smooth render loop with Lerp (Linear Interpolation) for silky motion
  function renderLoop() {
    // Smooth transition factor (0.15 provides natural momentum and responsiveness)
    const lerpFactor = 0.15;
    const diff = targetFrame - currentFrame;

    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * lerpFactor;
      renderFrame(currentFrame);
    }

    requestAnimationFrame(renderLoop);
  }

  // Start preloading
  preloadImages();
})();
