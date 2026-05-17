import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { AnimatedH2 } from '../utils/animations';

/* Parallax-scrolling image within its card */
const ParallaxImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  return (
    <div ref={ref} className="project-image-container">
      <motion.img src={src} alt={alt} className="project-image" style={{ y, scale: 1.18 }} />
    </div>
  );
};

const TiltCard = ({ children, className, delay }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    /* Spotlight */
    if (cardRef.current) {
      cardRef.current.style.setProperty('--cx', `${e.clientX - rect.left}px`);
      cardRef.current.style.setProperty('--cy', `${e.clientY - rect.top}px`);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--cx', '-9999px');
      cardRef.current.style.setProperty('--cy', '-9999px');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ z: 8 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <div className="card-spotlight" aria-hidden="true" />
      {children}
    </motion.div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Diabetes Tracker",
      description: "A comprehensive diabetes tracking web application focused on long-term health monitoring, allowing users to track blood sugar levels, diet, and analyze health trends over time.",
      details: [
        "Developed a user-friendly interface for daily blood sugar and diet tracking",
        "Implemented data visualization with Chart.js for weekly/monthly/yearly health trends",
        "Created secure user authentication system for private health data",
        "Built export functionality for generating reports in CSV/PDF formats for medical professionals"
      ],
      technologies: ["React", "Node.js", "Express", "MongoDB", "Chart.js", "TailwindCSS"],
      github: "https://github.com/Sridhanush-Varma/diabetes-tracker.git",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Resume Matcher",
      description: "An intelligent web application that utilizes NLP and ML techniques to analyze, compare, and score resumes against job descriptions.",
      details: [
        "Implemented TF-IDF Vectorization and Cosine Similarity for semantic content matching",
        "Developed automatic skill extraction from resumes and job descriptions",
        "Created interactive UI with real-time feedback and visualizations",
        "Implemented secure file handling with validation and temporary file cleanup"
      ],
      technologies: ["Python", "Flask", "scikit-learn", "TF-IDF", "HTML/CSS", "JavaScript"],
      github: "https://github.com/Sridhanush-Varma/Resume-Matcher.git",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Anoki — The AI & Tools Hub",
      description: "A modern web application designed as a centralized platform for discovering and accessing a variety of online tools and AI services.",
      details: [
        "Developed a responsive interface with Next.js 14 and TypeScript",
        "Implemented dark mode with persistent user preferences via local storage",
        "Created file upload and basic media editing features",
        "Set up automated deployment using GitHub Actions"
      ],
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "GitHub Actions"],
      github: "https://github.com/Sridhanush-Varma/Anoki.git",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Voxa - Voice-Enabled Smart Chatbot",
      description: "An advanced Python-based intelligent chatbot that supports voice interactions, natural language processing, weather information retrieval, web search capabilities, and an expanded knowledge base with advanced response generation.",
      details: [
        "Implemented voice input/output capabilities using SpeechRecognition and pyttsx3",
        "Integrated weather information retrieval using OpenWeatherMap API",
        "Added web search capabilities using Google Custom Search API",
        "Developed advanced NLP with sentiment analysis and context awareness",
        "Created an expandable knowledge base with facts and Q&A pairs",
        "Built task execution for time queries, calculations, and information retrieval"
      ],
      technologies: ["Python", "NLTK", "SpeechRecognition", "pyttsx3", "scikit-learn", "requests", "BeautifulSoup", "Google API", "TextBlob"],
      github: "https://github.com/Sridhanush-Varma/Voxa.git",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  const EASE = [0.22, 1, 0.36, 1];

  const tagContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } }
  };

  const detailContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const detailItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } }
  };

  return (
    <motion.section
      id="projects"
      className="section projects-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatedH2>Projects</AnimatedH2>
      <p className="section-description">
        A selection of my recent work in web development, natural language processing, machine learning, health monitoring applications, and computer vision.
      </p>
      <div className="projects-container">
        {projects.map((project, index) => (
          <TiltCard key={index} className="project-card" delay={index * 0.1}>
            <ParallaxImage src={project.image} alt={project.title} />
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <div className="project-details-container">
                <h4>Key Features</h4>
                <motion.ul
                  className="project-details"
                  variants={detailContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  {project.details.map((detail, idx) => (
                    <motion.li key={idx} variants={detailItemVariants}>
                      {detail}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                className="project-technologies"
                variants={tagContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {project.technologies.map((tech, idx) => (
                  <motion.span
                    key={idx}
                    className="technology-tag"
                    variants={tagVariants}
                    whileHover={{ y: -3, scale: 1.08 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>

              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <i className="fab fa-github"></i>
                <span>View on GitHub</span>
              </motion.a>
            </div>
          </TiltCard>
        ))}
      </div>
    </motion.section>
  );
};

export default Projects;
