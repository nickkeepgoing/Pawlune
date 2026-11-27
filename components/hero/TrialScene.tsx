'use client';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

/**
 * The fourteen days, in space.
 *
 * One rounded form per day along a shallow arc. Days already lived rise and take the warm
 * key light; days still ahead sit low and unlit. The scene has a job — it shows how far
 * through the trial the visitor has scrubbed — so it is not decoration and it does not
 * animate on its own. It answers the drag, and otherwise holds still.
 */
export default function TrialScene({ dayRef, className = '' }: { dayRef: RefObject<number>; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return; // No WebGL: the hero still reads completely without it.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.9, 11.5);
    camera.lookAt(0, -0.2, 0);

    const warm = new THREE.PointLight(0xffc98a, 0, 40, 1.4);
    const cool = new THREE.DirectionalLight(0xbfd0dc, 0.8);
    cool.position.set(-4, 5, 4);
    scene.add(warm, cool, new THREE.AmbientLight(0xffffff, 0.7));

    const DAYS = 14;
    const lit = new THREE.Color(0xe8b877);
    // Light enough to read as fourteen waiting days against the panel — at day 1 the
    // whole fortnight still has to be visible, or the hero looks empty on arrival.
    const unlit = new THREE.Color(0x7d6b59);

    const geometry = new THREE.CapsuleGeometry(0.17, 0.5, 6, 16);
    const stones: { mesh: THREE.Mesh; material: THREE.MeshStandardMaterial; baseY: number }[] = [];

    for (let i = 0; i < DAYS; i++) {
      const t = i / (DAYS - 1);
      const material = new THREE.MeshStandardMaterial({ color: unlit.clone(), roughness: 0.75, metalness: 0 });
      const mesh = new THREE.Mesh(geometry, material);
      // A shallow arc walking left to right, dipping towards the middle — the hard part of the fortnight.
      const x = (t - 0.5) * 11.4;
      const baseY = -1.1 + Math.sin(t * Math.PI) * -0.55;
      mesh.position.set(x, baseY, Math.sin(t * Math.PI) * 1.2 - 0.6);
      mesh.rotation.z = (t - 0.5) * 0.5;
      scene.add(mesh);
      stones.push({ mesh, material, baseY });
    }

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 20),
      new THREE.MeshStandardMaterial({ color: 0x2f251e, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.75;
    scene.add(floor);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Eased towards the scrubbed value so dragging feels weighted rather than snapping.
    let shown = dayRef.current ?? 1;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.01 });
    io.observe(host);

    const draw = () => {
      const target = dayRef.current ?? 1;
      shown += (target - shown) * 0.18;

      for (let i = 0; i < stones.length; i++) {
        const { mesh, material, baseY } = stones[i];
        // How fully this day has been reached: 0 ahead, 1 behind.
        const reached = Math.max(0, Math.min(1, shown - i));
        mesh.position.y = baseY + reached * 0.55;
        mesh.scale.setScalar(0.85 + reached * 0.35);
        material.color.copy(unlit).lerp(lit, reached);
        material.emissive.copy(lit).multiplyScalar(reached * 0.22);
      }

      // The warm light travels with the scrub and grows as the fortnight is lived.
      const t = (shown - 1) / (DAYS - 1);
      warm.position.set((t - 0.5) * 11.4, -0.1, 1.4);
      warm.intensity = 6 + t * 26;
      renderer.render(scene, camera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible && !document.hidden) draw();
    };
    draw();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      geometry.dispose();
      stones.forEach((s) => s.material.dispose());
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [dayRef]);

  return <div ref={hostRef} aria-hidden className={`pointer-events-none ${className}`} />;
}
