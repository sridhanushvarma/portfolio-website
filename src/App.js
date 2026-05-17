import React, { useEffect, useState } from 'react';
import { Header, Skills, Education, Projects, Section, Footer } from './components';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion, useScroll, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { AnimatedH2 } from './utils/animations';

const EASE = [0.22, 1, 0.36, 1];

/* ── Theater curtain — two panels split on page load ─────── */
const PageCurtain = () => (
  <>
    <motion.div
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.85, ease: [0.87, 0, 0.13, 1], delay: 0.15 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '50.5vh', background: '#05050d', zIndex: 9998, transformOrigin: 'top' }}
    />
    <motion.div
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.85, ease: [0.87, 0, 0.13, 1], delay: 0.15 }}
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '50.5vh', background: '#05050d', zIndex: 9998, transformOrigin: 'bottom' }}
    />
  </>
);

/* ── Scroll progress bar ─────────────────────────────────── */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress-bar" style={{ scaleX }} />;
};

/* ── Cursor glow orb ─────────────────────────────────────── */
const CursorGlow = () => {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const xSpring = useSpring(x, { stiffness: 55, damping: 22 });
  const ySpring = useSpring(y, { stiffness: 55, damping: 22 });

  useEffect(() => {
    const update = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, [x, y]);

  return <motion.div className="cursor-glow" style={{ left: xSpring, top: ySpring }} />;
};

/* ── Floating background particles ──────────────────────── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 4.55) % 100}%`,
  delay: i * 0.38,
  duration: 9 + (i % 6) * 2.2,
  size: i % 4 === 0 ? 3.5 : i % 3 === 0 ? 2.2 : 1.4,
  opacity: i % 4 === 0 ? 0.25 : i % 3 === 0 ? 0.18 : 0.12,
  color: i % 5 === 0 ? 'rgba(59,130,246,0.8)' : 'rgba(6,182,212,0.8)',
}));

const Particles = () => (
  <div className="bg-particles" aria-hidden="true">
    {PARTICLES.map(p => (
      <motion.div
        key={p.id}
        className="particle"
        style={{
          left: p.left,
          width: p.size,
          height: p.size,
          bottom: -10,
          background: p.color,
        }}
        animate={{
          y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 30 : 900)],
          opacity: [0, p.opacity, p.opacity * 0.7, 0],
        }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
      />
    ))}
  </div>
);

/* ── Scroll-to-top button ────────────────────────────────── */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: EASE }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ── Fixed section progress dots ────────────────────────── */
const SECTION_IDS = ['summary', 'skills', 'education', 'projects'];

const SectionDots = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="section-dots"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
    >
      {SECTION_IDS.map((id, i) => (
        <motion.a
          key={id}
          href={`#${id}`}
          className={`section-dot${active === i ? ' active' : ''}`}
          animate={{ scale: active === i ? 1.4 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          title={id.charAt(0).toUpperCase() + id.slice(1)}
        />
      ))}
    </motion.div>
  );
};

/* ── Professional Summary paragraph word stagger ─────────── */
const SUMMARY =
  'A versatile Computer Science professional with expertise in full-stack web development, ' +
  'natural language processing, health monitoring applications, and computer vision. ' +
  'Skilled in building intelligent applications using modern frameworks and machine learning ' +
  'techniques. Experienced in Python, JavaScript, TypeScript, React, Next.js, Express.js, ' +
  'Flask, and various ML/NLP libraries. Passionate about creating innovative solutions that ' +
  'combine cutting-edge technologies with intuitive user experiences.';

const SummaryText = () => {
  const words = SUMMARY.split(' ');
  return (
    <motion.p
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.025, delayChildren: 0.3 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

function App() {
  return (
    <Router basename="/portfolio-website">
      <div className="App">
        <PageCurtain />
        <ScrollProgress />
        <CursorGlow />
        <Particles />
        <SectionDots />
        <ScrollToTop />

        <Header />

        <main>
          <Section id="summary">
            <AnimatedH2>Professional Summary</AnimatedH2>
            <SummaryText />
          </Section>

          <Skills />
          <Education />
          <Projects />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
