import React from 'react';
import { motion } from 'framer-motion';

const Education = () => {
  const educationItems = [
    {
      degree: "Bachelor's Degree in Computer Science",
      institution: "Holy Mary Institute of Technology and Science",
      location: "Hyderabad, India",
      duration: "2022 - 2026",
      year: "2026",
      grade: "CGPA: 7.9/10",
      description: "Focusing on computer vision, image processing, and artificial intelligence. Participating in research projects and hackathons related to computer vision applications."
    },
    {
      degree: "Intermediate Education (11th & 12th)",
      institution: "Sri Chaitanya Junior College",
      location: "Hyderabad, India",
      duration: "2020 - 2022",
      year: "2022",
      grade: "Percentage: 83%",
      description: "Specialized in Mathematics, Physics, and Computer Science. Participated in various coding competitions and science exhibitions."
    },
    {
      degree: "Secondary School Education (10th)",
      institution: "Bharathi Vidya Bhavans",
      location: "Hyderabad, India",
      duration: "2019 - 2020",
      year: "2020",
      grade: "CGPA: 9.4/10",
      description: "Received recognition for excellence in mathematics and science. Developed interest in programming and technology."
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
      id="education"
      className="section education-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2>Education</h2>
      <p className="section-description">
        My academic journey in computer science and technology.
      </p>

      <div className="education-timeline">
        {educationItems.map((item, index) => (
          <motion.div
            key={index}
            className="education-item"
            variants={itemVariants}
          >
            <div className="education-item-content">
              <div className="education-year">{item.duration}</div>
              <h3>{item.degree}</h3>
              <div className="education-institution">
                <i className="fas fa-university"></i> {item.institution}
              </div>
              <div className="education-location">
                <i className="fas fa-map-marker-alt"></i> {item.location}
              </div>
              <div className="education-grade">
                <i className="fas fa-award"></i> {item.grade}
              </div>
              <p className="education-description">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Education;