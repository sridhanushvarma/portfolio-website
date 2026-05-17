import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { saveProfileImageToFirebase, loadProfileImageFromFirebase, saveResumeToFirebase, loadResumeFromFirebase } from '../utils/firebase';
import { CountUp } from '../utils/animations';

/* Magnetic wrapper — attracts toward cursor on hover */
const MagneticLink = ({ children, href, target, rel, variants, className, style }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 180, damping: 18 });
  const ySpring = useSpring(y, { stiffness: 180, damping: 18 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={{ ...style, x: xSpring, y: ySpring }}
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.a>
  );
};

// Helper function to check if a static file exists
const checkStaticFileExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper function to download a file (used by downloadResume)
// eslint-disable-next-line no-unused-vars
const downloadFile = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Header = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [profileImage, setProfileImage] = useState('https://github.com/Sridhanush-Varma.png');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('resume.pdf');
  const [resumeLastUpdated, setResumeLastUpdated] = useState(null);
  const [showResumeUploadModal, setShowResumeUploadModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showInstructions, setShowInstructions] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const headerRef = useRef(null);
  const ADMIN_PASSWORD = "Deepika@04";

  // Scroll-based nav glassmorphism
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollY.on('change', v => setIsScrolled(v > 80));
    return unsubscribe;
  }, [scrollY]);

  // Parallax on hero background
  const { scrollYProgress: heroProgress } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start']
  });
  const bgY = useTransform(heroProgress, [0, 1], ['0%', '30%']);

  // Load profile image on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        // First, try to load from Firebase (this is the shared storage for all users)
        const firebaseImage = await loadProfileImageFromFirebase();
        if (firebaseImage) {
          console.log('Loading profile image from Firebase');
          setProfileImage(firebaseImage);
          return;
        }

        // Try to load custom profile image from static directory
        const profileImageUrl = `${process.env.PUBLIC_URL}/static/profile/profile.jpg`;
        const profileImagePngUrl = `${process.env.PUBLIC_URL}/static/profile/profile.png`;

        // Check if JPG exists
        const jpgExists = await checkStaticFileExists(profileImageUrl);
        if (jpgExists) {
          setProfileImage(profileImageUrl);
          return;
        }

        // Check if PNG exists
        const pngExists = await checkStaticFileExists(profileImagePngUrl);
        if (pngExists) {
          setProfileImage(profileImagePngUrl);
          return;
        }

        // If no custom image, use GitHub profile picture as default
        setProfileImage('https://github.com/Sridhanush-Varma.png');
      } catch (error) {
        console.error('Error loading profile image:', error);
        // Fallback to GitHub profile picture
        setProfileImage('https://github.com/Sridhanush-Varma.png');
      }
    };

    loadProfileImage();
  }, []);

  // Load resume on component mount
  useEffect(() => {
    const loadResume = async () => {
      try {
        // First, try to load from Firebase (this is the shared storage for all users)
        const firebaseResume = await loadResumeFromFirebase();
        if (firebaseResume) {
          console.log('Loading resume from Firebase');
          setResumeData(firebaseResume.data);
          setResumeFileName(firebaseResume.fileName);
          return;
        }

        // Try to load resume from static directory
        const resumeUrl = `${process.env.PUBLIC_URL}/static/resume/resume.pdf`;
        const exists = await checkStaticFileExists(resumeUrl);

        if (exists) {
          setResumeData(resumeUrl);
          setResumeFileName('resume.pdf');
        }
      } catch (error) {
        console.error('Error loading resume:', error);
      }
    };

    loadResume();
  }, []);

  // Update preview canvas when crop changes
  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const updatePreview = async () => {
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        if (!crop || !canvas || !image) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        // Set canvas size to match the crop dimensions
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        // Apply device pixel ratio for sharper preview
        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the cropped image
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
      };

      updatePreview();
    }
  }, [completedCrop]);

  // Function to handle admin login
  const handleAdminLogin = () => {
    const password = prompt("Enter admin password:");
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Invalid password!");
    }
  };

  // Function to handle image file selection
  const onSelectFile = (e) => {
    console.log('File selection triggered');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('Selected file:', file.name, file.type, file.size);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        console.log('File read successfully');
        setImgSrc(reader.result.toString() || '');
        setShowCropModal(true);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading the selected file. Please try again.');
      };
      reader.readAsDataURL(file);

      // Reset the input value so the same file can be selected again
      e.target.value = '';
    } else {
      console.log('No file selected');
    }
  };

  // Function to handle image load for cropping
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;

    // Create a centered crop with aspect ratio 1:1 (circle)
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  // Function to generate the cropped image
  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) {
      console.error('Missing required elements for cropping');
      return null;
    }

    const image = imgRef.current;
    const crop = completedCrop;

    // Validate crop dimensions
    if (!crop.width || !crop.height) {
      console.error('Invalid crop dimensions');
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to match the crop dimensions
    canvas.width = crop.width;
    canvas.height = crop.height;

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the cropped image
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convert canvas to blob and then to data URL
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty - failed to create blob');
          reject(new Error('Failed to create image blob'));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read image data'));
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  // Function to save the cropped image
  const saveCroppedImage = async () => {
    try {
      console.log('Starting image crop and save process...');
      const croppedImageData = await generateCroppedImage();

      if (!croppedImageData) {
        throw new Error('Failed to generate cropped image');
      }

      console.log('Cropped image generated successfully');

      // Update the UI immediately
      setProfileImage(croppedImageData);
      const now = new Date();
      setLastUpdated(now.toLocaleString());

      console.log('UI updated with new image');

      // Save to Firebase for persistence across all users
      await saveProfileImageToFirebase(croppedImageData);

      console.log('Image saved to Firebase');

      // Close the modal and reset state
      setShowCropModal(false);
      setImgSrc('');

      // Show success message
      alert('Profile picture updated successfully! The new image will be visible to all visitors.');
    } catch (e) {
      console.error('Error saving cropped image:', e);
      alert(`Failed to save the profile picture: ${e.message}. Please try again.`);
    }
  };

  // Function to close the crop modal
  const closeCropModal = () => {
    setShowCropModal(false);
    setImgSrc('');
  };

  // Function to handle resume file selection
  const onSelectResumeFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a valid PDF file.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const resumeDataUrl = reader.result.toString();
          setResumeData(resumeDataUrl);
          setResumeFileName(file.name);
          const now = new Date();
          setResumeLastUpdated(now.toLocaleString());

          // Save to Firebase
          await saveResumeToFirebase(resumeDataUrl, file.name);

          alert('Resume uploaded successfully! The new resume will be available to all visitors.');
          setShowResumeUploadModal(false);
        } catch (error) {
          console.error('Error saving resume:', error);
          alert(`Failed to save the resume: ${error.message}. Please try again.`);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading the selected file. Please try again.');
      };
      reader.readAsDataURL(file);

      // Reset the input value
      e.target.value = '';
    }
  };

  // Function to download resume
  const downloadResume = () => {
    if (!resumeData) {
      alert('No resume available for download.');
      return;
    }

    const link = document.createElement('a');
    link.href = resumeData;
    link.download = resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const EASE = [0.22, 1, 0.36, 1];

  /* Name — word blur reveal */
  const nameWords = 'Sridhanush Varma'.split(' ');
  const nameContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } }
  };
  const nameWordVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } }
  };

  /* Social icons — stagger */
  const socialContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.75 } }
  };
  const socialItemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } }
  };

  /* Nav links — stagger from top */
  const navContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
  };
  const navItemVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }
  };

  /* Contact badges — individual stagger */
  const badgeContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } }
  };
  const badgeItemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.88 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } }
  };

  return (
    <motion.header
      ref={headerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Parallax background + ambient orbs */}
      <motion.div className="hero-parallax-bg" style={{ y: bgY }} aria-hidden="true" />
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
      <div className="hero-orb hero-orb-3" aria-hidden="true" />

      {/* Orbit decoration rings */}
      <div className="hero-orbit hero-orbit-1" aria-hidden="true">
        <div className="hero-orbit-dot"></div>
      </div>
      <div className="hero-orbit hero-orbit-2" aria-hidden="true">
        <div className="hero-orbit-dot" style={{ background: 'var(--blue)', boxShadow: '0 0 8px var(--blue)' }}></div>
      </div>

      <div className={`nav-container${isScrolled ? ' scrolled' : ''}`}>
        <div className="logo">
          <span>SV</span>
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <motion.ul
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { href: '#summary', label: 'About' },
              { href: '#skills', label: 'Skills' },
              { href: '#education', label: 'Education' },
              { href: '#projects', label: 'Projects' },
            ].map(({ href, label }) => (
              <motion.li key={href} variants={navItemVariants}>
                <a href={href}>{label}</a>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        <div className="header-actions">
          <button
            className="download-resume-btn"
            onClick={downloadResume}
            title="Download Resume"
          >
            <i className="fas fa-download"></i> Download Resume
          </button>

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
          <div className="profile-image-wrapper">
            <div className="profile-sonar" aria-hidden="true">
              <div className="profile-sonar-ring"></div>
              <div className="profile-sonar-ring"></div>
              <div className="profile-sonar-ring"></div>
            </div>
            <div className="profile-ring">
              <div className="profile-picture-container">
                <motion.img
                  src={profileImage}
                  alt="Profile Picture"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                {isAdmin && (
                  <label htmlFor="profile-upload" className="profile-upload-label">
                    <i className="fas fa-camera"></i>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="profile-upload"
                      onChange={onSelectFile}
                    />
                  </label>
                )}
              </div>
            </div>
            {lastUpdated && (
              <div className="profile-last-updated">
                <i className="fas fa-clock"></i> Updated: {lastUpdated}
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="admin-resume-section">
              <button
                className="admin-resume-btn"
                onClick={() => setShowResumeUploadModal(true)}
                title="Upload Resume"
              >
                <i className="fas fa-file-pdf"></i> Upload Resume
              </button>
              {resumeLastUpdated && (
                <div className="resume-last-updated">
                  <i className="fas fa-clock"></i> Resume Updated: {resumeLastUpdated}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resume Upload Modal */}
        {showResumeUploadModal && (
          <div className="resume-upload-modal-overlay">
            <div className="resume-upload-modal">
              <div className="resume-modal-header">
                <h3>Upload Resume</h3>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowResumeUploadModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="resume-modal-content">
                <p>Select a PDF file to upload as your resume</p>
                <label htmlFor="resume-upload" className="resume-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Click to select PDF file</span>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="resume-upload-input"
                    onChange={onSelectResumeFile}
                  />
                </label>
                {resumeFileName && (
                  <div className="resume-file-info">
                    <i className="fas fa-file-pdf"></i>
                    <span>{resumeFileName}</span>
                  </div>
                )}
              </div>
              <div className="resume-modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowResumeUploadModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Crop Modal */}
        {showCropModal && (
          <div className="crop-modal-overlay">
            <div className="crop-modal">
              <div className="crop-modal-header">
                <h3>Crop Profile Picture</h3>
                <button className="close-modal-btn" onClick={closeCropModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="crop-container">
                {imgSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                )}
              </div>
              <div className="crop-preview">
                <h4>Preview</h4>
                <div className="preview-container">
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      width: completedCrop?.width ?? 0,
                      height: completedCrop?.height ?? 0,
                      borderRadius: '50%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
              <div className="crop-actions">
                <button className="cancel-btn" onClick={closeCropModal}>Cancel</button>
                <button className="save-btn" onClick={saveCroppedImage}>Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="header-text">
          <motion.h1
            variants={nameContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {nameWords.map((word, i) => (
              <motion.span
                key={i}
                variants={nameWordVariants}
                className="name-char"
                style={{ marginRight: '0.35em' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="profession"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.55, ease: EASE }}
          >
            Full Stack Developer &amp; ML/NLP Specialist
          </motion.p>

          <motion.div
            className="contact-info"
            variants={badgeContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: 'fas fa-envelope', text: 'sridhanushvarmasv@outlook.com' },
              { icon: 'fas fa-phone-alt', text: '91+ 7799955255' },
              { icon: 'fas fa-map-marker-alt', text: 'Hyderabad, India' },
            ].map(({ icon, text }) => (
              <motion.span
                key={text}
                variants={badgeItemVariants}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className={icon}></i> {text}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="social-links"
            variants={socialContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { href: 'https://github.com/Sridhanush-Varma', icon: 'fab fa-github', external: true },
              { href: 'https://www.linkedin.com/in/sridhanush-varma/', icon: 'fab fa-linkedin-in', external: true },
              { href: 'mailto:sridhanushvarmasv@outlook.com', icon: 'fas fa-envelope', external: false }
            ].map(({ href, icon, external }, i) => (
              <MagneticLink
                key={i}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                variants={socialItemVariants}
                className="social-link-item"
              >
                <i className={icon}></i>
              </MagneticLink>
            ))}
          </motion.div>

          {/* Stats counter row */}
          <motion.div
            className="hero-stats"
            variants={badgeContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { end: 6,  suffix: '+', label: 'Projects' },
              { end: 20, suffix: '+', label: 'Technologies' },
              { end: 4,  suffix: '+', label: 'Years Learning' },
              { end: 3,  suffix: '',  label: 'ML Domains' },
            ].map(({ end, suffix, label }) => (
              <motion.div key={label} className="hero-stat-item" variants={badgeItemVariants}>
                <span className="hero-stat-number">
                  <CountUp end={end} suffix={suffix} />
                </span>
                <span className="hero-stat-label">{label}</span>
              </motion.div>
            ))}
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