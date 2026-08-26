import * as THREE from "three";

export type HeroFieldOptions = {
  canvas: HTMLCanvasElement;
  reducedMotion?: boolean;
  isMobile?: boolean;
};

/**
 * Graphite machined surface — slow mass, pointer-reactive displacement.
 * Not a glowing blob: folded metallic field with machining grain.
 */
export class HeroField {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private raf = 0;
  private visible = true;
  private disposed = false;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private scrollVel = 0;
  private scrollVelTarget = 0;
  private observer: IntersectionObserver | null = null;
  private onResize: () => void;
  private onPointer: (e: PointerEvent) => void;
  private onVisibility: () => void;
  private reduced: boolean;
  private isMobile: boolean;

  constructor(opts: HeroFieldOptions) {
    this.reduced = !!opts.reducedMotion;
    this.isMobile = !!opts.isMobile;

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: !this.isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x050505, 1);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, this.isMobile ? 1.25 : 1.75),
    );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(0.15, 0.05, 2.05);

    const segs = this.isMobile ? 80 : 140;
    const geo = new THREE.PlaneGeometry(4.2, 2.8, segs, Math.floor(segs * 0.66));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElev;
        varying vec3 vNormalW;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float t = uTime * 0.12;
          float fold = sin(pos.x * 2.1 + t) * cos(pos.y * 1.55 - t * 0.65);
          float machine = noise(pos.xy * 4.2 + t * 0.25) * 0.11;
          float ridge = sin(pos.x * 22.0 + cos(pos.y * 5.0) * 2.2) * 0.018;
          float pointerPull = exp(-length(pos.xy - uPointer * vec2(1.7, 1.05)) * 1.6) * 0.28;
          float elev = fold * 0.26 + machine + ridge + pointerPull - uScroll * 0.1;
          pos.z += elev;
          vElev = elev;
          float eR = noise((pos.xy + vec2(0.04, 0.0)) * 4.2) * 0.11;
          float eU = noise((pos.xy + vec2(0.0, 0.04)) * 4.2) * 0.11;
          vec3 n = normalize(vec3(elev - eR, elev - eU, 0.35));
          vNormalW = normalize(normalMatrix * n);
          vec4 world = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * world;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec2 vUv;
        varying float vElev;
        varying vec3 vNormalW;

        void main() {
          vec3 base = vec3(0.06, 0.063, 0.068);
          vec3 graphite = vec3(0.125, 0.13, 0.138);
          vec3 brushed = vec3(0.22, 0.235, 0.25);
          vec3 silver = vec3(0.68, 0.71, 0.75);

          vec3 N = normalize(vNormalW);
          float light = pow(max(dot(N, normalize(vec3(0.45, 0.75, 0.6))), 0.0), 1.6);
          float rim = pow(1.0 - max(dot(N, vec3(0.0, 0.15, 1.0)), 0.0), 2.2);
          float grain = fract(sin(dot(vUv * 420.0, vec2(12.9898, 78.233))) * 43758.5453);
          float brush = sin(vUv.x * 140.0 + vUv.y * 18.0) * 0.5 + 0.5;

          vec3 col = mix(base, graphite, smoothstep(-0.08, 0.16, vElev));
          col = mix(col, brushed, light * 0.72 + brush * 0.08);
          col += silver * rim * 0.28;
          col += silver * light * 0.12;
          col += (grain - 0.5) * 0.05;

          float vignette = smoothstep(1.2, 0.2, length(vUv - vec2(0.55, 0.42)));
          col *= mix(0.62, 1.05, vignette);

          float pointerGlow = exp(-length(vUv - (uPointer * 0.5 + 0.5)) * 3.4) * 0.1;
          col += vec3(0.78, 0.81, 0.84) * pointerGlow;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.rotation.x = -0.48;
    this.mesh.position.set(0.35, 0.05, 0);
    this.scene.add(this.mesh);

    this.onResize = () => this.resize();
    this.onPointer = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    this.onVisibility = () => {
      if (document.hidden) this.stop();
      else if (this.visible && !this.reduced) this.start();
    };

    window.addEventListener("resize", this.onResize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.reduced && !document.hidden) this.start();
        else this.stop();
      },
      { threshold: 0.05 },
    );
    this.observer.observe(opts.canvas);

    this.resize();
    if (!this.reduced) this.start();
  }

  setScrollVelocity(v: number) {
    this.scrollVelTarget = Math.max(-1.5, Math.min(1.5, v));
  }

  private resize() {
    const canvas = this.renderer.domElement;
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uRes.value.set(w, h);
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
    const lerp = this.isMobile ? 0.04 : 0.055;
    this.pointer.x += (this.pointer.tx - this.pointer.x) * lerp;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * lerp;
    this.scrollVel += (this.scrollVelTarget - this.scrollVel) * 0.06;
    this.scrollVelTarget *= 0.92;

    this.material.uniforms.uTime.value = t;
    this.material.uniforms.uPointer.value.set(this.pointer.x, this.pointer.y);
    this.material.uniforms.uScroll.value = this.scrollVel;

    this.mesh.rotation.z = this.pointer.x * 0.035;
    this.mesh.position.x = 0.35 + this.pointer.x * 0.08;
    this.mesh.position.y = 0.05 + this.pointer.y * 0.05;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.observer?.disconnect();
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
