import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, id, className }) => {
  return (
    <motion.section
      id={id}
      className={`section ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  );
};

export default Section; 