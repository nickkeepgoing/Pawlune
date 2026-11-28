'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Two groups of soft shapes circling a shared centre: the household on one side,
 * the animals on the other, drifting until a pair lines up. It sits behind the
 * matching section, so the picture is about things fitting together rather than
 * being decoration for its own sake.
 *
 * Pastel and lit for a light page. Pauses off screen, stills completely for
 * reduced motion, and reads its colours from the theme so it follows light/dark.
 */
const readColor = (name: string, fallback: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(raw || fallback);
};

export default function MatchScene({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return; // No WebGL: the section reads fine without it.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.6, 10);

    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(2, 5, 6);
    const rim = new THREE.DirectionalLight(0xffe6c0, 0.9);
    rim.position.set(-5, -2, 3);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 1.25));

    const COUNT = 7;
    const group = new THREE.Group();
    scene.add(group);

    const geometries = [
      new THREE.IcosahedronGeometry(0.62, 3),
      new THREE.CapsuleGeometry(0.34, 0.5, 8, 20),
      new THREE.TorusGeometry(0.46, 0.19, 20, 48),
    ];
    const materials: { material: THREE.MeshStandardMaterial; tone: number }[] = [];
    const orbs: { mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: number; bob: number }[] = [];

    for (let i = 0; i < COUNT * 2; i++) {
      const inner = i < COUNT; // the household ring and the animals ring
      const material = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.02 });
      materials.push({ material, tone: i % 3 });
      const mesh = new THREE.Mesh(geometries[i % geometries.length], material);
      mesh.scale.setScalar(inner ? 0.9 : 0.72);
      group.add(mesh);
      orbs.push({
        mesh,
        radius: inner ? 2.1 : 3.6,
        speed: inner ? 0.16 : -0.1,
        phase: ((i % COUNT) / COUNT) * Math.PI * 2,
        tilt: inner ? 0.18 : -0.3,
        bob: 0.2 + Math.random() * 0.25,
      });
    }

    const paint = () => {
      const palette = [readColor('--c-sage', '#A9C3A0'), readColor('--c-honey', '#C08A4A'), readColor('--c-jade', '#46654F')];
      materials.forEach(({ material, tone }) => material.color.copy(palette[tone]));
    };
    paint();

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

    const themeWatcher = new MutationObserver(paint);
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', paint);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.01 });
    io.observe(host);

    const place = (t: number) => {
      for (const o of orbs) {
        const a = o.phase + t * o.speed;
        o.mesh.position.set(Math.cos(a) * o.radius, Math.sin(a) * o.radius * o.tilt + Math.sin(t * 0.7 + o.phase) * o.bob, Math.sin(a) * o.radius * 0.35);
        o.mesh.rotation.x = a * 0.5;
        o.mesh.rotation.y = a * 0.35;
      }
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      place(t);
      group.rotation.y += (pointer.x * 0.28 - group.rotation.y) * 0.03;
      group.rotation.x += (-pointer.y * 0.16 - group.rotation.x) * 0.03;
      renderer.render(scene, camera);
    };

    place(0);
    renderer.render(scene, camera);
    if (!reduced.matches) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeWatcher.disconnect();
      scheme.removeEventListener('change', paint);
      window.removeEventListener('pointermove', onPointer);
      geometries.forEach((g) => g.dispose());
      materials.forEach(({ material }) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={`pointer-events-none ${className}`} />;
}
