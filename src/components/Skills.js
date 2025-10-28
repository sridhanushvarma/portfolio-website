import React from 'react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      id="skills"
      className="section skills-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2>Technical Skills</h2>
      <p className="section-description">
        My expertise spans full-stack web development, natural language processing, machine learning, health monitoring applications, and computer vision technologies.
      </p>

      <div className="skills-container">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            className="skill-category"
            variants={itemVariants}
          >
            <h3>{category.category}</h3>
            <div className="skill-tags">
              {category.skills.map((skill, skillIndex) => (
                <motion.span
                  key={skillIndex}
                  className="skill-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (catIndex * 0.1) + (skillIndex * 0.05) }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Skills;