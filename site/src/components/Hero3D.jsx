import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import wallUrl from "../assets/wall.jpg";
import skUrl from "../assets/sk.webp";
import cutoutUrl from "../assets/cutout.webp";
import depthUrl from "../assets/depth.png";
import normalUrl from "../assets/normal.png";
import shadowUrl from "../assets/shadow.png";
import heroUrl from "../assets/hero.jpg";

/**
 * Layered 3D portrait:
 *   wall  →  extruded "SK" letters  →  soft shadow  →  displaced 3D cut-out of you
 * Pointer / touch / idle-sway drive the parallax. Falls back to the flat photo if WebGL fails.
 */
const ASPECT = 1122 / 1402; // photo ratio
const CARD_H = 3.3;
const CARD_W = CARD_H * ASPECT;

function roundedAlpha(radius = 0.06) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = Math.round(512 / ASPECT);
  const g = c.getContext("2d");
  const r = c.width * radius;
  g.fillStyle = "#000";
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#fff";
  g.beginPath();
  g.roundRect(0, 0, c.width, c.height, r);
  g.fill();
  return new THREE.CanvasTexture(c);
}

export default function Hero3D() {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    const rig = new THREE.Group(); // everything that tilts
    scene.add(rig);

    // ---------- lights ----------
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffe2c4, 2.2);
    key.position.set(-3, 3, 5);
    scene.add(key);
    const rimG = new THREE.PointLight(0x32e59a, 9, 9);
    rimG.position.set(-2.6, 0.5, 1.6);
    scene.add(rimG);
    const rimP = new THREE.PointLight(0x8b7cff, 9, 9);
    rimP.position.set(2.8, 1.6, 1.4);
    scene.add(rimP);

    const loader = new THREE.TextureLoader();
    const tex = (url, srgb = true) => {
      const t = loader.load(url);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    };

    const disposables = [];

    // ---------- wall card ----------
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W, CARD_H),
      new THREE.MeshStandardMaterial({
        map: tex(wallUrl),
        alphaMap: roundedAlpha(),
        transparent: true,
        roughness: 0.9,
        metalness: 0,
      })
    );
    wall.position.z = -0.9;
    rig.add(wall);

    // glowing edge frame
    const frameShape = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W + 0.06, CARD_H + 0.06),
      new THREE.MeshBasicMaterial({ color: 0x32e59a, transparent: true, opacity: 0.35, alphaMap: roundedAlpha(0.066) })
    );
    frameShape.position.z = -0.93;
    rig.add(frameShape);

    // ---------- extruded SK letters (stacked slices) ----------
    const letters = new THREE.Group();
    const skTex = tex(skUrl);
    const SLICES = 14;
    for (let i = 0; i < SLICES; i++) {
      const t = i / (SLICES - 1); // 0 back → 1 front
      const m = new THREE.MeshStandardMaterial({
        map: skTex,
        transparent: true,
        alphaTest: 0.35,
        roughness: 0.75,
        color: new THREE.Color().setScalar(0.28 + 0.72 * t),
      });
      const p = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H), m);
      p.position.z = -0.62 + t * 0.22;
      letters.add(p);
    }
    rig.add(letters);

    // ---------- soft shadow ----------
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W, CARD_H),
      new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: tex(shadowUrl, false), transparent: true, opacity: 0.55, depthWrite: false })
    );
    shadow.position.set(0.16, -0.06, -0.5);
    rig.add(shadow);

    // ---------- 3D person (displaced) ----------
    const person = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W, CARD_H, 180, 225),
      new THREE.MeshStandardMaterial({
        map: tex(cutoutUrl),
        displacementMap: tex(depthUrl, false),
        displacementScale: 0.55,
        displacementBias: -0.05,
        normalMap: tex(normalUrl, false),
        normalScale: new THREE.Vector2(0.9, 0.9),
        transparent: true,
        alphaTest: 0.04,
        roughness: 0.55,
        metalness: 0.02,
        side: THREE.DoubleSide,
      })
    );
    person.position.z = 0.02;
    rig.add(person);

    // ---------- halo rings + particles (outside the card) ----------
    const rings = [];
    [2.35, 2.75].forEach((r, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.006, 8, 200),
        new THREE.MeshBasicMaterial({ color: i ? 0x8b7cff : 0x32e59a, transparent: true, opacity: 0.4 })
      );
      ring.rotation.x = Math.PI / 2.3 + i * 0.3;
      ring.rotation.z = i * 0.8;
      ring.position.z = -0.2;
      rig.add(ring);
      rings.push(ring);
    });
    const N = 500;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 2.2 + Math.random() * 2.6, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(b) * Math.cos(a) * 1.15;
      pos[i * 3 + 1] = r * Math.cos(b) * 0.95;
      pos[i * 3 + 2] = r * Math.sin(b) * Math.sin(a) - 0.5;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x7fffd0, size: 0.018, transparent: true, opacity: 0.55, depthWrite: false }));
    scene.add(particles);

    // ---------- sizing ----------
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // fit the card (plus margin) inside the canvas
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const needH = CARD_H * 1.18, needW = CARD_W * 1.32;
      const distH = needH / 2 / Math.tan(fov / 2);
      const distW = needW / 2 / (Math.tan(fov / 2) * camera.aspect);
      camera.position.set(0, 0, Math.max(distH, distW));
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ---------- interaction ----------
    let tx = 0, ty = 0, cx = 0, cy = 0, visible = true;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1.3, 1.3);
      ty = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1.3, 1.3);
    };
    const onLeave = () => { tx = 0; ty = 0; };
    addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0.01 });
    io.observe(el);

    // gentle intro
    rig.scale.setScalar(0.86);
    rig.rotation.y = -0.6;

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const idleX = reduce ? 0 : Math.sin(t * 0.6) * 0.35;
      const idleY = reduce ? 0 : Math.cos(t * 0.45) * 0.18;
      cx += ((tx || idleX) - cx) * 0.06;
      cy += ((ty || idleY) - cy) * 0.06;

      rig.rotation.y += (cx * 0.34 - rig.rotation.y) * 0.08;
      rig.rotation.x += (cy * 0.16 - rig.rotation.x) * 0.08;
      rig.scale.setScalar(rig.scale.x + (1 - rig.scale.x) * 0.05);

      // depth-dependent shift = parallax
      person.position.x = cx * 0.1;
      person.position.y = -cy * 0.05;
      letters.position.x = -cx * 0.08;
      shadow.position.x = 0.16 + cx * 0.06;
      wall.position.x = -cx * 0.03;

      rimG.position.x = -2.6 + Math.sin(t * 0.8) * 0.6;
      rimP.position.x = 2.8 + Math.cos(t * 0.7) * 0.6;
      if (!reduce) {
        rings.forEach((r, i) => { r.rotation.z += 0.0012 * (i + 1); r.rotation.y += 0.0005 * (i + 1); });
        particles.rotation.y += 0.0004;
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => { Object.values(m).forEach((v) => v && v.isTexture && v.dispose()); m.dispose(); });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="hero3d" ref={mount} aria-label="Interactive 3D portrait of Sudhakar">
      {failed && <img className="hero3d-fallback" src={heroUrl} alt="Sudhakar portrait" />}
    </div>
  );
}
