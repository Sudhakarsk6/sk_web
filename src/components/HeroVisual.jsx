import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import skUrl from "../assets/sk.webp";
import shadowUrl from "../assets/shadow.png";
import personUrl from "../assets/cutout.png";

/**
 * Lightweight hero visual (no WebGL): the "SK" wordmark, a soft contact
 * shadow, and your photo — a transparent PNG — stacked as plain layers.
 * Framer Motion drives a gentle pointer-tilt + parallax and a slow idle
 * float, so it still reads as "3D" without any canvas/renderer overhead.
 */
export default function HeroVisual() {
  const ref = useRef(null);
  const reduce =
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springCfg = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), springCfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), springCfg);
  const personX = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), springCfg);
  const personY = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), springCfg);
  const lettersX = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), springCfg);
  const lettersY = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), springCfg);
  const shadowX = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), springCfg);

  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="hero3d" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        className="hv-rig"
        style={{ rotateX, rotateY }}
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={reduce ? {} : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Each layer: an outer div holds the fixed CSS placement/depth
            transform; the inner motion.div carries only the parallax x/y so
            Framer Motion never overwrites the base positioning transform. */}
        <div className="hv-layer hv-letters">
          <motion.div style={{ x: lettersX, y: lettersY }}>
            <img src={skUrl} alt="" aria-hidden="true" draggable={false} />
          </motion.div>
        </div>
        <div className="hv-layer hv-shadow">
          <motion.div style={{ x: shadowX }}>
            <img src={shadowUrl} alt="" aria-hidden="true" draggable={false} />
          </motion.div>
        </div>
        <div className="hv-layer hv-person">
          <motion.div style={{ x: personX, y: personY }}>
            <img src={personUrl} alt="Sudhakar SK" draggable={false} />
          </motion.div>
        </div>
      </motion.div>
      <div className="hv-glow" />
    </div>
  );
}
