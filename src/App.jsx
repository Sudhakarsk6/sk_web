import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import HeroVisual from "./components/HeroVisual.jsx";
import { Reveal, SectionHead, TextReveal, ShinyButton, SpotlightCard, Counter, Marquee } from "./components/ui.jsx";
import portrait from "./assets/portrait.jpg";
import nature from "./assets/nature.jpg";

/* ============================ DATA ============================ */
const NAV = [
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["background", "Background"],
  ["contact", "Contact"],
];

const SKILLS = [
  "Python", "Batch Scripting", "SQL", "C / C++", "Java", "Pytest", "Selenium WebDriver", "Django",
  "Kivy / KivyMD", "BIOS & Firmware", "Microcode Validation", "TPM / TXT", "USB & Thunderbolt",
  "Thermal & Sensors", "Manageability", "Git & GitHub", "MySQL", "Firebase", "HTML / CSS / JS",
  "Bootstrap", "HSDES", "Jira", "Windows", "Linux",
];

const PROJECTS = [
  {
    n: "01", tag: "Platform Validation", title: "BIOS & Firmware Integration and Validation",
    text: "Functional, regression, stress, thermal and compatibility validation across four generations of client platforms — BIOS flashing, microcode updates, and root-cause analysis on hangs, crashes and boot failures.",
    stack: ["BIOS/Firmware", "Python", "Capsule / OSDLL", "Log Analysis"],
  },
  {
    n: "02", tag: "Test Automation", title: "No Harm — Test Environment Automation",
    text: "A Python and Batch application that takes a bare machine to a test-ready state: prerequisite validation, system configuration, long-duration test cycles, log collection and result reporting, built and maintained end to end.",
    stack: ["Python", "Batch", "Automated Reporting"],
  },
  {
    n: "03", tag: "Mobile App", title: "Journey Log",
    text: "A travel journalling mobile app with a clean UI for tracking, describing and organising trips. Presented at the International Conference on Prominent Challenges in Information Technology, 2023.",
    stack: ["Kivy", "KivyMD", "Firebase"],
  },
  {
    n: "04", tag: "Web App", title: "The Travel Tracker",
    text: "A Django and MySQL blog platform for travellers, with authentication, full CRUD and profile management. Presented at the National Conference on Trends in Advanced Computing and Applications, 2023.",
    stack: ["Django", "MySQL", "HTML/CSS/JS"],
  },
];

const CREDS = [
  {
    title: "Education",
    items: [
      ["MCA — 83%", "Adhiyamaan College of Engineering, Hosur · 2023"],
      ["B.Sc. Computer Science — 71%", "M.G.R. Arts and Science College, Hosur · 2021"],
    ],
  },
  {
    title: "Certifications",
    items: [
      ["AI & Automation Development Program", "UST Global · 2026"],
      ["Complete Python Bootcamp", "Udemy · 2025"],
      ["Automate the Boring Stuff with Python", "Udemy · 2025"],
    ],
  },
  {
    title: "Recognition",
    items: [
      ["Rising Star Award", "UST Global · 2024"],
      ["Journey Log Application", "International Conference on Prominent Challenges in IT · 2023"],
      ["The Travel Tracker", "National Conference on Trends in Advanced Computing · 2023"],
    ],
  },
];

const CONTACTS = [
  ["Email", "sudhakarsk101@gmail.com", "mailto:sudhakarsk101@gmail.com"],
  ["Phone", "+91 79048 44037", "tel:+917904844037"],
  ["LinkedIn", "in/sudhakarsk", "https://www.linkedin.com/in/sudhakarsk"],
  ["GitHub", "Sudhakarsk6", "https://github.com/Sudhakarsk6"],
  ["LeetCode", "u/sudhakarsk", "https://leetcode.com/u/sudhakarsk"],
  ["HackerRank", "sudhakarsk101", "https://www.hackerrank.com/sudhakarsk101"],
];

/* ============================ NAVBAR ============================ */
function Navbar() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <motion.header className="topbar" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      <nav className="nav">
        <a className="logo" href="#home">sudhakarsk</a>
        <ul className="links">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={active === id ? "active" : ""}>
                {label}
                {active === id && <motion.span layoutId="nav-pill" className="nav-pill" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a className="cta" href="mailto:sudhakarsk101@gmail.com">Hire Me</a>
          <button className={`burger ${open ? "on" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu"><span /><span /></button>
        </div>
      </nav>
      <motion.div className="progress" style={{ scaleX: bar }} />
      <AnimatePresence>
        {open && (
          <motion.ul className="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {NAV.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={() => setOpen(false)}>{label}</a></li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ============================ HERO ============================ */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } } };
const rise = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-bg" />
      <div className="shell hero-grid">
        <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="show" style={{ y, opacity: fade }}>
          <motion.div variants={rise} className="hero-status">
            AUTOMATION &amp; VALIDATION ENGINEER
          </motion.div>
          <motion.h1 variants={rise}>
            BUILD.<br /><em>CREATE.</em><br />VALIDATE.
          </motion.h1>
          <motion.p variants={rise} className="lead">
            I'm <b>Sudhakar S</b> — I build clean, reliable automation.
          </motion.p>
          <motion.div variants={rise} className="actions">
            <ShinyButton href="#projects">Explore Work ↗</ShinyButton>
            <ShinyButton href="#contact" variant="glass">Let's Connect</ShinyButton>
          </motion.div>
          <motion.div variants={rise} className="metrics">
            <div><b><Counter to={4} suffix="+" /></b><span>PLATFORM GENERATIONS</span></div>
            <div><b><Counter to={4} /></b><span>PROJECTS SHIPPED</span></div>
            <div><b>2026</b><span>CURRENTLY BUILDING</span></div>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
          <HeroVisual />
        </motion.div>
      </div>
      <div className="scroll-hint"><span>01</span><i /><span>SCROLL TO EXPLORE</span></div>
    </section>
  );
}

/* ============================ ABOUT ============================ */
function About() {
  return (
    <section id="about">
      <div className="shell">
        <SectionHead kicker="PROFILE" title="Engineering with a systems mindset." text="Automation, validation and software development across hardware-adjacent and full-stack projects." />
        <div className="about">
          <Reveal className="about-media">
            <SpotlightCard className="portrait">
              <img src={portrait} alt="Sudhakar S" loading="lazy" />
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.1}>
            <SpotlightCard className="about-card" tilt={false}>
              <h3>Python-first. Platform-aware.</h3>
              <p>My work spans functional, regression, stress, thermal and compatibility validation, plus the automation that makes those cycles repeatable and measurable.</p>
              <div className="facts">
                {[
                  ["Role", "Python Automation Engineer"],
                  ["Focus", "BIOS / Firmware Validation"],
                  ["Education", "MCA · 83% · 2023"],
                  ["Recognition", "Rising Star Award · 2024"],
                ].map(([b, s]) => (
                  <div className="fact" key={b}><b>{b}</b><span>{s}</span></div>
                ))}
              </div>
              <div className="stat-row">
                <div><b><Counter to={4} suffix="+" /></b><span>Platform gens</span></div>
                <div><b><Counter to={4} /></b><span>Projects</span></div>
                <div><b><Counter to={3} /></b><span>Certifications</span></div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================ SKILLS ============================ */
function Skills() {
  const half = Math.ceil(SKILLS.length / 2);
  return (
    <section id="skills">
      <div className="shell">
        <SectionHead kicker="TECHNICAL STACK" title="Tools that move the work forward." text="Full-stack automation and validation expertise across Python tooling, BIOS/firmware platforms and QA frameworks." />
      </div>
      <Marquee items={SKILLS.slice(0, half)} />
      <Marquee items={SKILLS.slice(half)} reverse />
      <div className="shell">
        <Reveal className="skill-cloud">
          {SKILLS.map((s, i) => (
            <motion.span key={s} className="skill" whileHover={{ y: -4, rotateX: 8 }} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}>
              {s}
            </motion.span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ============================ PROJECTS ============================ */
function Projects() {
  return (
    <section id="projects">
      <div className="shell">
        <SectionHead kicker="PORTFOLIO WORK" title="Projects with a purpose." text="A mix of platform validation work and the automation built to support it." />
        <div className="projects">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.n} delay={(i % 2) * 0.1} className="project-wrap">
              <SpotlightCard className="project">
                <div className="project-top"><span className="tag">PROJECT {p.n}</span><span className="tag accent">{p.tag}</span></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ FIELD NOTE (parallax) ============================ */
function FieldNote() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section className="cine" ref={ref}>
      <motion.div className="cine-bg" style={{ backgroundImage: `url(${nature})`, y }} />
      <div className="cine-shade" />
      <div className="shell cine-content">
        <Reveal>
          <div className="kicker">FIELD NOTE</div>
          <h2><TextReveal text="The best automation is the test cycle nobody has to run by hand twice." /></h2>
          <p>Reliable systems are built by removing unnecessary repetition while preserving visibility into what happened, why it happened, and what to do next.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================ BACKGROUND ============================ */
function Background() {
  return (
    <section id="background">
      <div className="shell">
        <SectionHead kicker="BACKGROUND" title="Education & certifications." />
        <div className="creds">
          {CREDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1} className="cred-wrap">
              <SpotlightCard className="cred" tilt={false}>
                <h3>{c.title}</h3>
                <ul>{c.items.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}</ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ CONTACT ============================ */
function Contact() {
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const n = f.get("name"), em = f.get("email"), m = f.get("msg");
    location.href = `mailto:sudhakarsk101@gmail.com?subject=${encodeURIComponent("Portfolio contact from " + n)}&body=${encodeURIComponent(`${m}\n\n— ${n} (${em})`)}`;
  };
  return (
    <section id="contact">
      <div className="shell">
        <SectionHead kicker="GET IN TOUCH" title="Let's build something great." text="Open to Python automation, QA automation and platform validation roles." />
        <div className="contact">
          <Reveal>
            <SpotlightCard className="formbox" tilt={false}>
              <form onSubmit={submit}>
                <label htmlFor="name">NAME</label>
                <input id="name" name="name" required />
                <label htmlFor="email">EMAIL</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="msg">MESSAGE</label>
                <textarea id="msg" name="msg" rows={6} required />
                <motion.button className="btn primary" type="submit" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                  <span className="btn-shine" /><span className="btn-label">Send Message ↗</span>
                </motion.button>
              </form>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.1}>
            <SpotlightCard className="contact-list" tilt={false}>
              {CONTACTS.map(([k, v, href]) => (
                <a key={k} className="contact-row" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <span>{k}</span><span>{v}</span>
                </a>
              ))}
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <FieldNote />
        <Background />
        <Contact />
      </main>
    </>
  );
}
