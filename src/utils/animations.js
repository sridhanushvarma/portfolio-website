import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/* ── Animated h2 — character-by-character rotateX reveal ─── */
export const AnimatedH2 = ({ children, className }) => {
  const chars = String(children).split('');
  return (
    <motion.h2
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.032, delayChildren: 0.06 } }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ perspective: '600px' }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', transformOrigin: '50% 0%' }}
          variants={{
            hidden: { opacity: 0, y: 16, rotateX: -90 },
            visible: {
              opacity: 1, y: 0, rotateX: 0,
              transition: { duration: 0.44, ease: EASE }
            }
          }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

/* ── CountUp — RAF cubic-ease number counter ─────────────── */
export const CountUp = ({ end, suffix = '', duration = 1600 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};
