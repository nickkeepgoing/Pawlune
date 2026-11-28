'use client';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

/**
 * Six pet toys built from simple shapes: yarn ball, mouse, fish, bone, feather wand, ring.
 *
 * Tap one and it hops. No model files are loaded, so there is nothing to download or
 * license. The loop pauses off screen; with reduced motion the toys are drawn once and
 * stay still.
 */

const COLOR = {
  sage: 0xa9c3a0, jade: 0x6f9a82, rose: 0xe39b8a, honey: 0xe8b877,
  cream: 0xf4e7cf, stone: 0xbfb3a6, dark: 0x352620, white: 0xffffff,
};

type Mats = Map<number, THREE.MeshStandardMaterial>;

function builder(mats: Mats, geos: THREE.BufferGeometry[]) {
  const mat = (color: number) => {
    let m = mats.get(color);
    if (!m) { m = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.02 }); mats.set(color, m); }
    return m;
  };
  return (parent: THREE.Group, geometry: THREE.BufferGeometry, color: number, at: [number, number, number] = [0, 0, 0]) => {
    geos.push(geometry);
    const mesh = new THREE.Mesh(geometry, mat(color));
    mesh.position.set(...at);
    parent.add(mesh);
    return mesh;
  };
}

const curve = (points: [number, number, number][]) => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
const sphere = (r: number) => new THREE.SphereGeometry(r, 28, 20);

function makeToys(add: ReturnType<typeof builder>): THREE.Group[] {
  const yarn = new THREE.Group();
  add(yarn, sphere(0.62), COLOR.rose);
  for (let i = 0; i < 11; i++) {
    const wrap = add(yarn, new THREE.TorusGeometry(0.62, 0.03, 8, 48), i % 3 ? COLOR.rose : COLOR.cream);
    wrap.rotation.set(i * 0.9, i * 1.7, i * 0.4);
  }
  add(yarn, new THREE.TubeGeometry(curve([[0.35, -0.45, 0.3], [0.8, -0.65, 0.35], [1.0, -0.55, 0.1], [1.15, -0.68, -0.1]]), 32, 0.032, 8), COLOR.rose);

  const mouse = new THREE.Group();
  add(mouse, sphere(0.55), COLOR.stone).scale.set(1.3, 0.85, 0.9);
  add(mouse, sphere(0.09), COLOR.rose, [0.74, -0.02, 0]);
  for (const z of [-0.27, 0.27]) {
    const ear = add(mouse, new THREE.CylinderGeometry(0.2, 0.2, 0.06, 24), COLOR.rose, [0.18, 0.46, z]);
    ear.rotation.set(0, 0, Math.PI / 2);
    add(mouse, sphere(0.055), COLOR.dark, [0.56, 0.16, z * 0.8]);
  }
  add(mouse, new THREE.TubeGeometry(curve([[-0.65, -0.1, 0], [-0.95, -0.2, 0.15], [-1.05, 0.15, 0.05], [-0.85, 0.4, 0]]), 32, 0.045, 8), COLOR.rose);

  const fish = new THREE.Group();
  add(fish, sphere(0.58), COLOR.jade).scale.set(1.3, 0.82, 0.5);
  const tail = add(fish, new THREE.ConeGeometry(0.42, 0.55, 24), COLOR.honey, [-0.95, 0, 0]);
  tail.rotation.z = -Math.PI / 2; tail.scale.z = 0.25;
  add(fish, new THREE.ConeGeometry(0.22, 0.34, 20), COLOR.honey, [-0.05, 0.55, 0]).scale.z = 0.25;
  for (const z of [-0.27, 0.27]) {
    add(fish, sphere(0.11), COLOR.white, [0.4, 0.1, z]);
    add(fish, sphere(0.055), COLOR.dark, [0.43, 0.1, z * 1.3]);
  }

  const bone = new THREE.Group();
  add(bone, new THREE.CylinderGeometry(0.2, 0.2, 1.1, 24), COLOR.cream).rotation.z = Math.PI / 2;
  for (const x of [-0.62, 0.62]) for (const y of [-0.2, 0.2]) add(bone, sphere(0.27), COLOR.cream, [x, y, 0]);
  bone.rotation.z = 0.35;

  const wand = new THREE.Group();
  const stick = add(wand, new THREE.CylinderGeometry(0.045, 0.045, 1.5, 12), COLOR.honey, [-0.25, -0.15, 0]);
  stick.rotation.z = -0.7;
  add(wand, new THREE.TubeGeometry(curve([[0.23, 0.42, 0], [0.55, 0.45, 0], [0.55, 0.1, 0]]), 24, 0.016, 6), COLOR.dark);
  [COLOR.jade, COLOR.rose, COLOR.sage].forEach((c, i) => {
    const feather = add(wand, sphere(0.28), c, [0.55 + (i - 1) * 0.17, -0.22, i * 0.02]);
    feather.scale.set(0.35, 1.25, 0.12); feather.rotation.z = (i - 1) * 0.55;
  });

  const ring = new THREE.Group();
  add(ring, new THREE.TorusGeometry(0.55, 0.2, 24, 64), COLOR.sage);
  add(ring, sphere(0.2), COLOR.honey, [0, -0.55, 0.18]);
  add(ring, new THREE.TorusGeometry(0.2, 0.025, 8, 32), COLOR.dark, [0, -0.55, 0.18]).rotation.x = Math.PI / 2;

  return [yarn, mouse, fish, bone, wand, ring];
}

export default function ToyScene({ hopAllRef, className = '' }: { hopAllRef: RefObject<() => void>; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 2.4, 11);
    camera.lookAt(0, 0, 0);
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(3, 6, 5);
    scene.add(sun, new THREE.HemisphereLight(0xfff6e8, 0x8fa88a, 1.7));

    const mats: Mats = new Map();
    const geos: THREE.BufferGeometry[] = [];
    const toys = makeToys(builder(mats, geos));

    // A soft blot under each toy: it shrinks and fades as the toy leaves the floor.
    const ink = document.createElement('canvas');
    ink.width = ink.height = 128;
    const ctx = ink.getContext('2d')!;
    const fade = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    fade.addColorStop(0, 'rgba(53,38,32,0.42)');
    fade.addColorStop(1, 'rgba(53,38,32,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, 128, 128);
    const shadowMap = new THREE.CanvasTexture(ink);
    const shadowGeo = new THREE.PlaneGeometry(2, 1.3);
    const shadows = toys.map(() => {
      const m = new THREE.Mesh(shadowGeo, new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      scene.add(m);
      return m;
    });

    const state = toys.map((g, i) => {
      g.userData.index = i;
      scene.add(g);
      return { y: 0, v: 0, spin: 0, baseY: 0, tilt: g.rotation.z, phase: i * 1.1 };
    });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      const aspect = w / h;
      const wide = aspect > 1.7;
      toys.forEach((g, i) => {
        const x = wide ? (i - 2.5) * 2.4 : ((i % 3) - 1) * 2.2;
        const base = wide ? 0 : i < 3 ? 1.35 : -1.35;
        state[i].baseY = base;
        g.position.x = x;
        shadows[i].position.set(x, base - 0.95, 0);
      });
      const halfW = wide ? 7.2 : 3.4;
      const halfH = wide ? 1.9 : 2.9;
      camera.aspect = aspect;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.max(halfH, halfW / aspect) / camera.position.length()));
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const draw = (t: number, dt: number) => {
      toys.forEach((g, i) => {
        const s = state[i];
        if (s.y > 0 || s.v > 0) {
          s.v -= 14 * dt;
          s.y += s.v * dt;
          if (s.y <= 0) { s.y = 0; s.v = Math.abs(s.v) > 1.6 ? -s.v * 0.45 : 0; }
        }
        s.spin *= Math.pow(0.12, dt);
        g.position.y = s.baseY + s.y + Math.sin(t * 1.3 + s.phase) * 0.07;
        g.rotation.y += s.spin * dt;
        if (s.spin < 0.3) g.rotation.y = Math.atan2(Math.sin(g.rotation.y), Math.cos(g.rotation.y));
        if (s.spin < 0.3) g.rotation.y += (Math.sin(t * 0.5 + s.phase) * 0.45 - g.rotation.y) * Math.min(1, dt * 2);
        g.rotation.z = s.tilt + Math.sin(t * 0.9 + s.phase) * 0.06;
        const lift = Math.max(0, 1 - s.y / 2.2);
        shadows[i].scale.setScalar(0.55 + 0.45 * lift);
        (shadows[i].material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.65 * lift;
      });
      renderer.render(scene, camera);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hop = (i: number) => {
      if (reduced) return;
      state[i].v = 5.2;
      state[i].spin = 11;
    };
    hopAllRef.current = () => toys.forEach((_, i) => window.setTimeout(() => hop(i), i * 90));

    const ray = new THREE.Raycaster();
    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      let o: THREE.Object3D | null = ray.intersectObjects(toys, true)[0]?.object ?? null;
      while (o && o.userData.index === undefined) o = o.parent;
      return o ? (o.userData.index as number) : -1;
    };
    const down = (e: PointerEvent) => { const i = pick(e); if (i >= 0) hop(i); };
    const move = (e: PointerEvent) => { renderer.domElement.style.cursor = pick(e) >= 0 ? 'pointer' : 'default'; };
    renderer.domElement.addEventListener('pointerdown', down);
    renderer.domElement.addEventListener('pointermove', move);

    const ro = new ResizeObserver(() => { resize(); draw(0, 0); });
    ro.observe(host);
    resize();
    draw(0, 0);

    let visible = false;
    let entered = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      // A single wave of hops the first time the shelf is seen, to show they respond.
      if (e.intersectionRatio > 0.5 && !entered) { entered = true; hopAllRef.current(); }
    }, { threshold: [0.01, 0.6] });
    io.observe(host);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) draw(now / 1000, dt);
    };
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', down);
      renderer.domElement.removeEventListener('pointermove', move);
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      shadows.forEach((s) => (s.material as THREE.Material).dispose());
      shadowGeo.dispose();
      shadowMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [hopAllRef]);

  return <div ref={hostRef} aria-hidden className={className} />;
}
