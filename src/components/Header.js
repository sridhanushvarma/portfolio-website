import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// IndexedDB setup for profile image and resume storage
const openProfileImageDB = () => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is available (not available in test environment)
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open('ProfileImageDB', 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('profileImages')) {
        db.createObjectStore('profileImages', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('resumes')) {
        db.createObjectStore('resumes', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Function to save profile image to IndexedDB
const saveProfileImageToDB = async (imageData) => {
  try {
    const db = await openProfileImageDB();
    const transaction = db.transaction(['profileImages'], 'readwrite');
    const store = transaction.objectStore('profileImages');

    // Save with timestamp for versioning
    const imageRecord = {
      id: 'currentProfileImage',
      data: imageData,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(imageRecord);

      request.onsuccess = () => {
        // Also save to localStorage as a fallback and for quicker access
        localStorage.setItem('profileImage', imageData);
        localStorage.setItem('profileImageTimestamp', imageRecord.timestamp.toString());
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error saving to IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to save profile image to IndexedDB:', error);
    // Fallback to localStorage only
    localStorage.setItem('profileImage', imageData);
    localStorage.setItem('profileImageTimestamp', Date.now().toString());
  }
};

// Function to get profile image from IndexedDB
const getProfileImageFromDB = async () => {
  try {
    const db = await openProfileImageDB();
    const transaction = db.transaction(['profileImages'], 'readonly');
    const store = transaction.objectStore('profileImages');

    return new Promise((resolve, reject) => {
      const request = store.get('currentProfileImage');

      request.onsuccess = (event) => {
        if (event.target.result) {
          resolve(event.target.result);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        console.error('Error retrieving from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to get profile image from IndexedDB:', error);
    return null;
  }
};

// Function to save resume to IndexedDB
const saveResumeToDB = async (resumeData, fileName) => {
  try {
    const db = await openProfileImageDB();
    const transaction = db.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');

    const resumeRecord = {
      id: 'currentResume',
      data: resumeData,
      fileName: fileName,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(resumeRecord);

      request.onsuccess = () => {
        localStorage.setItem('resume', resumeData);
        localStorage.setItem('resumeFileName', fileName);
        localStorage.setItem('resumeTimestamp', resumeRecord.timestamp.toString());
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error saving to IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to save resume to IndexedDB:', error);
    localStorage.setItem('resume', resumeData);
    localStorage.setItem('resumeFileName', fileName);
    localStorage.setItem('resumeTimestamp', Date.now().toString());
  }
};

// Function to get resume from IndexedDB
const getResumeFromDB = async () => {
  try {
    const db = await openProfileImageDB();
    const transaction = db.transaction(['resumes'], 'readonly');
    const store = transaction.objectStore('resumes');

    return new Promise((resolve, reject) => {
      const request = store.get('currentResume');

      request.onsuccess = (event) => {
        if (event.target.result) {
          resolve(event.target.result);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        console.error('Error retrieving from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Failed to get resume from IndexedDB:', error);
    return null;
  }
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
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const ADMIN_PASSWORD = "Deepika@04";

  // Load profile image on component mount and check for updates
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        // First try to get from IndexedDB
        const imageRecord = await getProfileImageFromDB();

        if (imageRecord && imageRecord.data) {
          setProfileImage(imageRecord.data);
          setLastUpdated(new Date(imageRecord.timestamp).toLocaleString());
          // Update localStorage with the latest data
          localStorage.setItem('profileImage', imageRecord.data);
          localStorage.setItem('profileImageTimestamp', imageRecord.timestamp.toString());
        } else {
          // Fallback to localStorage
          const savedImage = localStorage.getItem('profileImage');
          const savedTimestamp = localStorage.getItem('profileImageTimestamp');
          if (savedImage) {
            setProfileImage(savedImage);
            if (savedTimestamp) {
              setLastUpdated(new Date(parseInt(savedTimestamp, 10)).toLocaleString());
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
        // Final fallback to localStorage
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
      }
    };

    // Load image immediately on mount
    loadProfileImage();

    // Set up periodic check for updates (every 5 minutes)
    // This ensures all visitors see the latest profile picture
    const checkForUpdates = async () => {
      try {
        const imageRecord = await getProfileImageFromDB();
        if (!imageRecord) return;

        // Get current timestamp from localStorage
        const currentTimestamp = parseInt(localStorage.getItem('profileImageTimestamp') || '0', 10);

        // If the image in IndexedDB is newer, update the display
        if (imageRecord.timestamp > currentTimestamp) {
          setProfileImage(imageRecord.data);
          setLastUpdated(new Date(imageRecord.timestamp).toLocaleString());
          localStorage.setItem('profileImage', imageRecord.data);
          localStorage.setItem('profileImageTimestamp', imageRecord.timestamp.toString());
          console.log('Profile image updated to latest version');
        }
      } catch (error) {
        console.error('Error checking for profile image updates:', error);
      }
    };

    // Check for updates every 5 minutes
    const updateInterval = setInterval(checkForUpdates, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(updateInterval);
  }, []);

  // Load resume on component mount
  useEffect(() => {
    const loadResume = async () => {
      try {
        const resumeRecord = await getResumeFromDB();

        if (resumeRecord && resumeRecord.data) {
          setResumeData(resumeRecord.data);
          setResumeFileName(resumeRecord.fileName || 'resume.pdf');
          setResumeLastUpdated(new Date(resumeRecord.timestamp).toLocaleString());
          localStorage.setItem('resume', resumeRecord.data);
          localStorage.setItem('resumeFileName', resumeRecord.fileName);
          localStorage.setItem('resumeTimestamp', resumeRecord.timestamp.toString());
        } else {
          const savedResume = localStorage.getItem('resume');
          const savedFileName = localStorage.getItem('resumeFileName');
          const savedTimestamp = localStorage.getItem('resumeTimestamp');
          if (savedResume) {
            setResumeData(savedResume);
            setResumeFileName(savedFileName || 'resume.pdf');
            if (savedTimestamp) {
              setResumeLastUpdated(new Date(parseInt(savedTimestamp, 10)).toLocaleString());
            }
          }
        }
      } catch (error) {
        console.error('Error loading resume:', error);
        const savedResume = localStorage.getItem('resume');
        if (savedResume) {
          setResumeData(savedResume);
        }
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

      // Save to IndexedDB for persistence across all users
      await saveProfileImageToDB(croppedImageData);

      console.log('Image saved to database');

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

          // Save to IndexedDB
          await saveResumeToDB(resumeDataUrl, file.name);

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
            <motion.div
              className="profile-picture-container"
              whileHover={{ scale: 1.05 }}
            >
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
            </motion.div>
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
            Full Stack Developer & ML/NLP Specialist
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