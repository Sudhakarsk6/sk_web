import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionTemplate, useSpring, animate } from "framer-motion";

/* ---------- Reveal wrapper (fade + rise on scroll) ---------- */
export function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/* ---------- Section heading ---------- */
export function SectionHead({ kicker, title, text }) {
  return (
    <Reveal className="head">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}

/* ---------- Word-by-word text reveal (21st.dev style) ---------- */
export function TextReveal({ text, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------- Shiny / animated-border button ---------- */
export function ShinyButton({ href, children, variant = "primary", ...rest }) {
  return (
    <motion.a
      href={href}
      className={`btn ${variant}`}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      {...rest}
    >
      <span className="btn-shine" />
      <span className="btn-label">{children}</span>
    </motion.a>
  );
}

/* ---------- Spotlight card (mouse-follow glow + 3D tilt) ---------- */
export function SpotlightCard({ children, className = "", tilt = true }) {
  const ref = useRef(null);
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(50,229,154,.16), transparent 70%)`;

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    if (tilt) {
      ry.set((x / r.width - 0.5) * 8);
      rx.set(-(y / r.height - 0.5) * 8);
    }
  };
  const leave = () => { mx.set(-300); my.set(-300); rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`spot ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      <motion.div className="spot-glow" style={{ background: glow }} />
      <div className="spot-inner">{children}</div>
    </motion.div>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({ to, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: "easeOut", onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ---------- Infinite marquee ---------- */
export function Marquee({ items, reverse = false }) {
  const list = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div
        className="marquee-track"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {list.map((t, i) => (
          <span className="marquee-item" key={i}>{t}</span>
        ))}
      </motion.div>
    </div>
  );
}
