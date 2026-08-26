import * as THREE from "three";

export type MaterialSurfaceOptions = {
  canvas: HTMLCanvasElement;
  reducedMotion?: boolean;
  isMobile?: boolean;
};

/** Interactive graphite plate — light displacement + grain response */
export class MaterialSurface {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private raf = 0;
  private visible = false;
  private disposed = false;
  private pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vx: 0, vy: 0 };
  private observer: IntersectionObserver | null = null;
  private onResize: () => void;
  private onPointer: (e: PointerEvent) => void;
  private onVisibility: () => void;
  private reduced: boolean;
  private readoutCb?: (data: { velocity: number }) => void;

  constructor(
    opts: MaterialSurfaceOptions,
    onReadout?: (data: { velocity: number }) => void,
  ) {
    this.reduced = !!opts.reducedMotion;
    this.readoutCb = onReadout;
    const isMobile = !!opts.isMobile;

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x0b0c0d, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.6));

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocity: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uVelocity;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;
          vec2 d = uv - uPointer;
          float dist = length(d);
          float dent = exp(-dist * 8.0) * (0.04 + uVelocity * 0.08);
          float angle = atan(d.y, d.x);
          float brush = sin((uv.x * 90.0 + uv.y * 12.0) + cos(uv.y * 40.0)) * 0.5 + 0.5;
          float grain = hash(uv * 280.0 + uTime * 0.05 + uPointer * 2.0);

          vec3 base = vec3(0.055, 0.057, 0.06);
          vec3 c1 = vec3(0.12, 0.125, 0.132);
          vec3 c2 = vec3(0.22, 0.23, 0.245);
          vec3 hi = vec3(0.7, 0.73, 0.76);

          float light = 0.35 + brush * 0.25 + dent * 4.0;
          light += 0.15 * exp(-dist * 5.0) * (0.5 + 0.5 * cos(angle * 3.0 + uTime));
          vec3 col = mix(base, c1, light);
          col = mix(col, c2, smoothstep(0.55, 1.0, light));
          col += hi * pow(max(0.0, 1.0 - dist * 2.2), 3.0) * 0.12;
          col += (grain - 0.5) * 0.045;

          float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(0.0, 0.04, uv.y)
            * smoothstep(0.0, 0.04, 1.0 - uv.x) * smoothstep(0.0, 0.04, 1.0 - uv.y);
          col *= mix(0.7, 1.0, edge);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(this.mesh);

    this.onResize = () => this.resize();
    this.onPointer = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1 - (e.clientY - rect.top) / rect.height;
      this.pointer.vx = nx - this.pointer.tx;
      this.pointer.vy = ny - this.pointer.ty;
      this.pointer.tx = nx;
      this.pointer.ty = ny;
    };
    this.onVisibility = () => {
      if (document.hidden) this.stop();
      else if (this.visible && !this.reduced) this.start();
    };

    window.addEventListener("resize", this.onResize);
    opts.canvas.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.reduced && !document.hidden) this.start();
        else this.stop();
      },
      { threshold: 0.1 },
    );
    this.observer.observe(opts.canvas);

    this.resize();
  }

  private resize() {
    const canvas = this.renderer.domElement;
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || 600;
    const h = parent?.clientHeight || 400;
    this.renderer.setSize(w, h, false);
  }

  private start() {
    if (this.raf || this.disposed) return;
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      this.tick();
    };
    this.raf = requestAnimationFrame(loop);
  }

  private stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private tick() {
    const t = this.clock.getElapsedTime();
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.08;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.08;
    const vel = Math.min(1, Math.hypot(this.pointer.vx, this.pointer.vy) * 18);
    this.pointer.vx *= 0.85;
    this.pointer.vy *= 0.85;

    this.material.uniforms.uTime.value = t;
    this.material.uniforms.uPointer.value.set(this.pointer.x, this.pointer.y);
    this.material.uniforms.uVelocity.value = vel;
    this.readoutCb?.({ velocity: vel });

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.observer?.disconnect();
    window.removeEventListener("resize", this.onResize);
    this.renderer.domElement.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
