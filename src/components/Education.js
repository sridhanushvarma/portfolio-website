import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedH2 } from '../utils/animations';

const EASE = [0.22, 1, 0.36, 1];

/* Card wrapper — alternating slide-in */
const getSlideVariant = (index) => ({
  hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE, delay: index * 0.15 }
  }
});

/* Internal content — cascade each line */
const contentContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } }
};

const lineVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } }
};

const yearVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
};

const Education = () => {
  const educationItems = [
    {
      degree: "Bachelor's Degree in Computer Science",
      institution: "Holy Mary Institute of Technology and Science",
      location: "Hyderabad, India",
      duration: "2022 - 2026",
      grade: "CGPA: 7.9/10",
      description: "Focusing on computer vision, image processing, and artificial intelligence. Participating in research projects and hackathons related to computer vision applications."
    },
    {
      degree: "Intermediate Education (11th & 12th)",
      institution: "Sri Chaitanya Junior College",
      location: "Hyderabad, India",
      duration: "2020 - 2022",
      grade: "Percentage: 83%",
      description: "Specialized in Mathematics, Physics, and Computer Science. Participated in various coding competitions and science exhibitions."
    },
    {
      degree: "Secondary School Education (10th)",
      institution: "Bharathi Vidya Bhavans",
      location: "Hyderabad, India",
      duration: "2019 - 2020",
      grade: "CGPA: 9.4/10",
      description: "Received recognition for excellence in mathematics and science. Developed interest in programming and technology."
    }
  ];

  return (
    <motion.section
      id="education"
      className="section education-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <AnimatedH2>Education</AnimatedH2>
      <p className="section-description">
        My academic journey in computer science and technology.
      </p>

      <div className="education-timeline">
        {/* Animated gradient timeline line */}
        <motion.div
          className="education-timeline-line"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />

        {educationItems.map((item, index) => (
          <motion.div
            key={index}
            className="education-item"
            variants={getSlideVariant(index)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* Internal content stagger */}
            <motion.div
              className="education-item-content"
              variants={contentContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <motion.div className="education-year" variants={yearVariants}>
                {item.duration}
              </motion.div>

              <motion.h3 variants={lineVariants}>{item.degree}</motion.h3>

              <motion.div className="education-institution" variants={lineVariants}>
                <i className="fas fa-university"></i> {item.institution}
              </motion.div>

              <motion.div className="education-location" variants={lineVariants}>
                <i className="fas fa-map-marker-alt"></i> {item.location}
              </motion.div>

              <motion.div className="education-grade" variants={lineVariants}>
                <i className="fas fa-award"></i> {item.grade}
              </motion.div>

              <motion.p className="education-description" variants={lineVariants}>
                {item.description}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Education;
