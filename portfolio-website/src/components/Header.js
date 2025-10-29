import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ADMIN_PASSWORD = "Deepika@04";

  const handleAdminLogin = () => {
    const password = prompt("Enter admin password:");
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Invalid password!");
    }
  };

  const shareProfile = (platform) => {
    const profileUrl = window.location.href;
    const text = "Check out Sridhanush Varma's portfolio!";

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(text)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + profileUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent('Check out this portfolio: ' + profileUrl)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="nav-container">
        <div className="logo">
          <span>SV</span>
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#summary">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#projects">Projects</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="share-container">
            <button
              className="share-btn"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <i className="fas fa-share-alt"></i> Share
            </button>

            {showShareMenu && (
              <motion.div
                className="share-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button onClick={() => shareProfile('facebook')}><i className="fab fa-facebook-f"></i> Facebook</button>
                <button onClick={() => shareProfile('twitter')}><i className="fab fa-twitter"></i> Twitter</button>
                <button onClick={() => shareProfile('linkedin')}><i className="fab fa-linkedin-in"></i> LinkedIn</button>
                <button onClick={() => shareProfile('whatsapp')}><i className="fab fa-whatsapp"></i> WhatsApp</button>
                <button onClick={() => shareProfile('email')}><i className="fas fa-envelope"></i> Email</button>
              </motion.div>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      <div className="header-content">
        <div className="profile-section">
          <motion.div
            className="profile-picture-container"
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src="https://github.com/Sridhanush-Varma.png"
              alt="Profile Picture"
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
            {isAdmin && (
              <input type="file" accept="image/*" className="profile-upload" />
            )}
          </motion.div>
        </div>

        <div className="header-text">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sridhanush Varma
          </motion.h1>

          <motion.p
            className="profession"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Computer Vision & Image Processing Specialist
          </motion.p>

          <motion.div
            className="contact-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span><i className="fas fa-envelope"></i> sridhanushvarmasv@outlook.com</span>
            <span><i className="fas fa-phone-alt"></i> 91+ 7799955255</span>
            <span><i className="fas fa-map-marker-alt"></i> Hyderabad, India</span>
          </motion.div>

          <motion.div
            className="social-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a href="https://github.com/Sridhanush-Varma" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/sridhanush-varma/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="mailto:sridhanushvarmasv@outlook.com">
              <i className="fas fa-envelope"></i>
            </a>
          </motion.div>
        </div>
      </div>

      {!isAdmin && (
        <div className="admin-login-container">
          <button onClick={handleAdminLogin} className="admin-login-btn">
            <i className="fas fa-lock"></i> Admin
          </button>
        </div>
      )}
    </motion.header>
  );
};

export default Header;