import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sridhanush Varma</h3>
          <p>Full-Stack Developer & ML/NLP Specialist based in Hyderabad, India.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#summary">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#projects">Projects</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li><i className="fas fa-envelope"></i> sridhanushvarmasv@outlook.com</li>
            <li><i className="fas fa-phone-alt"></i> 91+ 7799955255</li>
            <li><i className="fas fa-map-marker-alt"></i> Hyderabad, India</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <div className="footer-social">
            <a href="https://github.com/Sridhanush-Varma" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/sridhanush-varma/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Sridhanush Varma. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
