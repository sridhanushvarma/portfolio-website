import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, id, className }) => {
  return (
    <motion.section
      id={id}
      className={`section ${className || ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
};

export default Section;
