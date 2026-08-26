/**
 * Interactive graphite surface for MATERIAL / 001.
 * Canvas 2D shader-like lighting — lighter than Three.js for this section,
 * still physically plausible specular response to pointer velocity.
 */
export class GraphiteSurface {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private disposed = false;
  private visible = true;
  private pointer = { x: 0.5, y: 0.5, vx: 0, vy: 0 };
  private light = { x: 0.55, y: 0.35 };
  private last = { x: 0.5, y: 0.5, t: performance.now() };
  private observer: IntersectionObserver | null = null;
  private reduced: boolean;
  private velocity = 0;
  private canvas: HTMLCanvasElement;

  onReadout?: (data: { velocity: number; lx: number; ly: number }) => void;

  constructor(canvas: HTMLCanvasElement, reducedMotion = false) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.reduced = reducedMotion;
    this.resize();
    this.bind();
    this.tick();
  }

  private bind() {
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("pointermove", this.onPointer);
    this.canvas.addEventListener("pointerleave", this.onLeave);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.canvas);
  }

  private onResize = () => this.resize();

  private onPointer = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const now = performance.now();
    const dt = Math.max((now - this.last.t) / 1000, 0.001);
    this.pointer.vx = (x - this.last.x) / dt;
    this.pointer.vy = (y - this.last.y) / dt;
    this.pointer.x = x;
    this.pointer.y = y;
    this.last = { x, y, t: now };
    this.velocity = Math.min(Math.hypot(this.pointer.vx, this.pointer.vy), 8);
  };

  private onLeave = () => {
    this.velocity *= 0.2;
  };

  private onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(this.raf);
    else if (!this.disposed) this.tick();
  };

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    if (!this.visible || document.hidden) return;

    this.light.x += (this.pointer.x - this.light.x) * (this.reduced ? 1 : 0.08);
    this.light.y += (this.pointer.y - this.light.y) * (this.reduced ? 1 : 0.08);
    this.velocity *= 0.96;

    this.draw();
    this.onReadout?.({
      velocity: this.velocity,
      lx: this.light.x,
      ly: this.light.y,
    });
  };

  private draw() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const ctx = this.ctx;

    // Base graphite
    const base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, "#0c0e10");
    base.addColorStop(0.45, "#111315");
    base.addColorStop(1, "#08090a");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // Soft specular bloom following light
    const lx = this.light.x * w;
    const ly = this.light.y * h;
    const radius = Math.max(w, h) * (0.42 + this.velocity * 0.02);
    const bloom = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius);
    bloom.addColorStop(0, `rgba(232, 234, 230, ${0.14 + this.velocity * 0.015})`);
    bloom.addColorStop(0.25, "rgba(120, 126, 130, 0.08)");
    bloom.addColorStop(0.55, "rgba(40, 44, 48, 0.04)");
    bloom.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);

    // Machined groove lines
    ctx.save();
    ctx.globalAlpha = 0.07 + this.velocity * 0.01;
    ctx.strokeStyle = "#a9adb0";
    ctx.lineWidth = 1;
    const gap = 28;
    for (let y = gap; y < h; y += gap) {
      ctx.beginPath();
      const offset = Math.sin(y * 0.02 + this.light.x * 4) * (6 + this.velocity);
      ctx.moveTo(0, y + offset);
      ctx.lineTo(w, y - offset * 0.4);
      ctx.stroke();
    }
    ctx.restore();

    // Edge occlusion
    const vignette = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      Math.min(w, h) * 0.2,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.72,
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Micro grain
    ctx.globalAlpha = 0.035;
    for (let i = 0; i < 120; i++) {
      const gx = (Math.sin(i * 12.9898 + this.light.x) * 0.5 + 0.5) * w;
      const gy = (Math.cos(i * 78.233 + this.light.y) * 0.5 + 0.5) * h;
      ctx.fillStyle = i % 2 === 0 ? "#fff" : "#000";
      ctx.fillRect(gx, gy, 1.2, 1.2);
    }
    ctx.globalAlpha = 1;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("pointermove", this.onPointer);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
  }
}
