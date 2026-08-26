import * as THREE from "three";

type Pointer = { x: number; y: number };

/**
 * Precision-machined mathematical artifact for the hero.
 * Folded metallic plates orbiting a central optical axis — mass, not sparkle.
 */
export class ArtifactField {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private root = new THREE.Group();
  private plates: THREE.Mesh[] = [];
  private ring: THREE.Mesh | null = null;
  private lights: { key: THREE.DirectionalLight; fill: THREE.DirectionalLight; rim: THREE.PointLight };
  private pointer: Pointer = { x: 0, y: 0 };
  private targetPointer: Pointer = { x: 0, y: 0 };
  private clock = new THREE.Clock();
  private raf = 0;
  private visible = true;
  private reduced: boolean;
  private disposed = false;
  private observer: IntersectionObserver | null = null;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, reducedMotion = false) {
    this.canvas = canvas;
    this.reduced = reducedMotion;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    this.camera.position.set(0.35, 0.2, 4.8);

    const amb = new THREE.AmbientLight(0x3a4046, 0.75);
    const key = new THREE.DirectionalLight(0xf4f4f1, 1.85);
    key.position.set(2.8, 3.6, 3.2);
    const fill = new THREE.DirectionalLight(0x8a9298, 0.85);
    fill.position.set(-3.2, -0.2, 2);
    const rim = new THREE.PointLight(0xe7e8e6, 2.2, 14);
    rim.position.set(-1.4, 1.8, -2.4);
    this.lights = { key, fill, rim };
    this.scene.add(amb, key, fill, rim, this.root);

    this.buildArtifact();
    this.resize();
    this.bind();
    this.tick();
  }

  private buildArtifact() {
    const metal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2a2e32"),
      metalness: 0.94,
      roughness: 0.22,
      envMapIntensity: 1,
    });

    const graphite = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#16191c"),
      metalness: 0.62,
      roughness: 0.48,
    });

    const edge = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#d2d5d3"),
      metalness: 1,
      roughness: 0.14,
      emissive: new THREE.Color("#1a1c1e"),
      emissiveIntensity: 0.15,
    });

    // Central optical cylinder
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.65, 48, 1, true),
      metal,
    );
    core.rotation.z = Math.PI / 2;
    this.root.add(core);

    const coreCapA = new THREE.Mesh(new THREE.CircleGeometry(0.18, 48), edge);
    coreCapA.position.x = 0.825;
    coreCapA.rotation.y = Math.PI / 2;
    const coreCapB = coreCapA.clone();
    coreCapB.position.x = -0.825;
    coreCapB.rotation.y = -Math.PI / 2;
    this.root.add(coreCapA, coreCapB);

    // Folded plates — hexagonal radial system
    const plateGeo = new THREE.BoxGeometry(1.55, 0.045, 0.72);
    for (let i = 0; i < 6; i++) {
      const plate = new THREE.Mesh(plateGeo, i % 2 === 0 ? metal : graphite);
      const angle = (i / 6) * Math.PI * 2;
      plate.position.set(Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0);
      plate.rotation.z = angle;
      plate.rotation.y = 0.35;
      plate.rotation.x = 0.12 * (i % 2 === 0 ? 1 : -1);
      this.plates.push(plate);
      this.root.add(plate);
    }

    // Inner diamond lattice (thin beams)
    const beamMat = edge.clone();
    beamMat.roughness = 0.32;
    for (let i = 0; i < 8; i++) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.012, 0.012), beamMat);
      beam.rotation.z = (i / 8) * Math.PI;
      beam.rotation.y = 0.4;
      this.root.add(beam);
    }

    // Outer precision ring
    const ringGeo = new THREE.TorusGeometry(1.55, 0.018, 16, 96);
    this.ring = new THREE.Mesh(ringGeo, edge);
    this.ring.rotation.x = Math.PI / 2.4;
    this.root.add(this.ring);

    // Floating calibration ticks
    for (let i = 0; i < 24; i++) {
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.008, 0.008),
        edge,
      );
      const a = (i / 24) * Math.PI * 2;
      tick.position.set(Math.cos(a) * 1.72, Math.sin(a) * 1.72, 0.15);
      tick.rotation.z = a;
      this.root.add(tick);
    }

    this.root.rotation.x = 0.35;
    this.root.rotation.y = -0.55;
  }

  private bind() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.05 },
    );
    this.observer.observe(this.canvas);
  }

  private onResize = () => this.resize();

  private onPointer = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.targetPointer.x = nx;
    this.targetPointer.y = ny;
  };

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
    } else if (!this.disposed) {
      this.clock.getDelta();
      this.tick();
    }
  };

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.updateProjectionMatrix();
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);

    if (!this.visible || document.hidden) return;

    const t = this.clock.getElapsedTime();
    this.pointer.x += (this.targetPointer.x - this.pointer.x) * 0.045;
    this.pointer.y += (this.targetPointer.y - this.pointer.y) * 0.045;

    if (!this.reduced) {
      this.root.rotation.y = -0.55 + this.pointer.x * 0.28 + t * 0.035;
      this.root.rotation.x = 0.35 + this.pointer.y * 0.16;
      this.root.position.y = Math.sin(t * 0.4) * 0.035;

      this.plates.forEach((plate, i) => {
        plate.rotation.y = 0.35 + Math.sin(t * 0.55 + i) * 0.08;
      });

      if (this.ring) {
        this.ring.rotation.z = t * 0.12;
      }

      this.lights.key.position.x = 2.4 + this.pointer.x * 1.8;
      this.lights.key.position.y = 3.2 - this.pointer.y * 1.2;
      this.lights.rim.intensity = 1.0 + Math.abs(this.pointer.x) * 0.35;
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
    this.renderer.dispose();
  }
}
