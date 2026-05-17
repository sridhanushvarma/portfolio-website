import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AnimatedH2 } from '../utils/animations';

const EASE = [0.22, 1, 0.36, 1];

const SkillCard = ({ category, skills, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const controls = useAnimation();

  /* Entrance → float chain */
  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: index * 0.1, ease: EASE }
      }).then(() => {
        controls.start({
          y: [0, -4, 0],
          transition: {
            duration: 4.5 + index * 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.12
          }
        });
      });
    }
  }, [isInView, controls, index]);

  /* Spotlight CSS vars */
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--cx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--cy', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--cx', '-9999px');
    ref.current.style.setProperty('--cy', '-9999px');
  };

  const tagContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.75, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: EASE } }
  };

  return (
    <motion.div
      ref={ref}
      className="skill-category"
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-spotlight" aria-hidden="true" />

      <h3>
        {category}
        <span className="skill-count-badge">{skills.length}</span>
      </h3>

      <motion.div
        className="skill-tags"
        variants={tagContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {skills.map((skill, skillIndex) => (
          <motion.span
            key={skillIndex}
            className="skill-tag"
            variants={tagVariants}
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

const Skills = () => {
  const skillCategories = [
    {
      category: "Programming Languages",
      skills: ["Python", "JavaScript", "TypeScript", "HTML/CSS"]
    },
    {
      category: "Frameworks & Libraries",
      skills: ["React", "Next.js", "Express.js", "Flask", "TailwindCSS", "Chart.js"]
    },
    {
      category: "Machine Learning & NLP",
      skills: ["scikit-learn", "TF-IDF Vectorization", "Natural Language Processing", "Text Similarity Analysis", "Sentiment Analysis", "Speech Recognition"]
    },
    {
      category: "Computer Vision & Image Processing",
      skills: ["OpenCV", "Image Processing", "Facial Recognition"]
    },
    {
      category: "Databases & DevOps",
      skills: ["MongoDB", "Mongoose", "GitHub Actions", "Deployment Automation"]
    },
    {
      category: "API Integrations",
      skills: ["RESTful APIs", "OpenWeatherMap API", "Google Custom Search API", "API Authentication"]
    }
  ];

  return (
    <motion.section
      id="skills"
      className="section skills-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <AnimatedH2>Technical Skills</AnimatedH2>
      <p className="section-description">
        My expertise spans full-stack web development, natural language processing, machine learning,
        health monitoring applications, and computer vision technologies.
      </p>

      <div className="skills-container">
        {skillCategories.map((category, catIndex) => (
          <SkillCard
            key={catIndex}
            category={category.category}
            skills={category.skills}
            index={catIndex}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default Skills;
