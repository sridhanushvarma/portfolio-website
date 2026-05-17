import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const footerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};

const footerSectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};

const linkContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
};

const linkVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } }
};

const contactVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } }
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <motion.div
        className="footer-content"
        variants={footerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* About column */}
        <motion.div className="footer-section" variants={footerSectionVariants}>
          <h3>Sridhanush Varma</h3>
          <p>Full-Stack Developer &amp; ML/NLP Specialist based in Hyderabad, India.</p>
        </motion.div>

        {/* Quick links column */}
        <motion.div className="footer-section" variants={footerSectionVariants}>
          <h3>Quick Links</h3>
          <motion.ul
            className="footer-links"
            variants={linkContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: 'About', href: '#summary' },
              { label: 'Skills', href: '#skills' },
              { label: 'Education', href: '#education' },
              { label: 'Projects', href: '#projects' },
            ].map(({ label, href }) => (
              <motion.li key={label} variants={linkVariants}>
                <a href={href}>{label}</a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Contact column */}
        <motion.div className="footer-section" variants={footerSectionVariants}>
          <h3>Contact</h3>
          <motion.ul
            className="footer-contact"
            variants={linkContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: 'fas fa-envelope', text: 'sridhanushvarmasv@outlook.com' },
              { icon: 'fas fa-phone-alt', text: '91+ 7799955255' },
              { icon: 'fas fa-map-marker-alt', text: 'Hyderabad, India' },
            ].map(({ icon, text }) => (
              <motion.li key={text} variants={contactVariants}>
                <i className={icon}></i> {text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Social column */}
        <motion.div className="footer-section" variants={footerSectionVariants}>
          <h3>Connect</h3>
          <div className="footer-social">
            {[
              { href: 'https://github.com/Sridhanush-Varma', icon: 'fab fa-github' },
              { href: 'https://www.linkedin.com/in/sridhanush-varma/', icon: 'fab fa-linkedin-in' },
              { href: 'mailto:sridhanushvarmasv@outlook.com', icon: 'fas fa-envelope' },
            ].map(({ href, icon }, i) => (
              <motion.a
                key={i}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.45, ease: EASE }}
                whileHover={{ rotate: 8, scale: 1.18, y: -5 }}
                whileTap={{ scale: 0.88 }}
              >
                <i className={icon}></i>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
      >
        <p>&copy; {currentYear} Sridhanush Varma. All rights reserved.</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
