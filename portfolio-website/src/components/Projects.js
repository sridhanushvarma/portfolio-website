import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
  const projects = [
    {
      title: "DiabetesTrack",
      description: "A comprehensive diabetes tracking web application focused on long-term health monitoring, allowing users to track blood sugar levels, diet, and analyze health trends over time.",
      details: [
        "Developed a user-friendly interface for daily blood sugar and diet tracking",
        "Implemented data visualization with Chart.js for weekly/monthly/yearly health trends",
        "Created secure user authentication system for private health data",
        "Built export functionality for generating reports in CSV/PDF formats for medical professionals"
      ],
      technologies: ["React", "Node.js", "Express", "MongoDB", "Chart.js", "TailwindCSS"],
      github: "https://github.com/Sridhanush-Varma/DiabetesTrack.git",
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
      title: "Photography Portfolio Website",
      description: "A full-stack web application for photographers to showcase their work professionally with a dynamic public-facing site and secure admin dashboard.",
      details: [
        "Built with Next.js, React, and TailwindCSS for responsive design",
        "Implemented secure admin authentication using NextAuth.js",
        "Created MongoDB database integration with Mongoose",
        "Developed photo management system with category-based filtering"
      ],
      technologies: ["Next.js", "React", "MongoDB", "NextAuth.js", "TailwindCSS"],
      github: "https://github.com/Sridhanush-Varma/Photography-Portfolio.git",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Image Processing Suite",
      description: "A comprehensive suite of image processing tools and algorithms for computer vision applications.",
      details: [
        "Developed algorithms for image dilation and erosion",
        "Implemented morphological gradient detection",
        "Created facial recognition system with live camera integration"
      ],
      technologies: ["Python", "OpenCV", "NumPy"],
      github: "https://github.com/Sridhanush-Varma/Image-Processing-Suite.git",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const projectVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const tagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.section
      id="projects"
      className="section projects-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2>Projects</h2>
      <p className="section-description">
        A selection of my recent work in web development, natural language processing, machine learning, health monitoring applications, and computer vision.
      </p>
      <div className="projects-container">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="project-card"
            variants={projectVariants}
            whileHover={{ y: -5 }}
          >
            <div className="project-image-container">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <div className="project-details-container">
                <h4>Key Features</h4>
                <ul className="project-details">
                  {project.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              <motion.div
                className="project-technologies"
                variants={containerVariants}
              >
                {project.technologies.map((tech, idx) => (
                  <motion.span
                    key={idx}
                    className="technology-tag"
                    variants={tagVariants}
                    whileHover={{ y: -2, scale: 1.05 }}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fab fa-github"></i> View on GitHub
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Projects;