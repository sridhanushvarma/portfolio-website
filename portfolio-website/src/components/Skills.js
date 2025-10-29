import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      category: "Programming Languages",
      skills: [
        { name: "Python", level: 95 },
        { name: "JavaScript", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "HTML/CSS", level: 90 }
      ]
    },
    {
      category: "Frameworks & Libraries",
      skills: [
        { name: "React", level: 85 },
        { name: "Next.js", level: 80 },
        { name: "Express.js", level: 82 },
        { name: "Flask", level: 85 },
        { name: "TailwindCSS", level: 90 },
        { name: "Chart.js", level: 85 }
      ]
    },
    {
      category: "Machine Learning & NLP",
      skills: [
        { name: "scikit-learn", level: 85 },
        { name: "TF-IDF Vectorization", level: 90 },
        { name: "Natural Language Processing", level: 85 },
        { name: "Text Similarity Analysis", level: 80 },
        { name: "Sentiment Analysis", level: 82 },
        { name: "Speech Recognition", level: 88 }
      ]
    },
    {
      category: "Computer Vision & Image Processing",
      skills: [
        { name: "OpenCV", level: 85 },
        { name: "Image Processing", level: 90 },
        { name: "Facial Recognition", level: 80 }
      ]
    },
    {
      category: "Databases & DevOps",
      skills: [
        { name: "MongoDB", level: 80 },
        { name: "Mongoose", level: 75 },
        { name: "GitHub Actions", level: 85 },
        { name: "Deployment Automation", level: 80 }
      ]
    },
    {
      category: "API Integrations",
      skills: [
        { name: "RESTful APIs", level: 88 },
        { name: "OpenWeatherMap API", level: 85 },
        { name: "Google Custom Search API", level: 82 },
        { name: "API Authentication", level: 80 }
      ]
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
            <div className="skill-bars">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  className="skill-bar-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + (catIndex * 0.1) + (skillIndex * 0.1) }}
                >
                  <div className="skill-bar-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 + (catIndex * 0.1) + (skillIndex * 0.1) }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Skills;