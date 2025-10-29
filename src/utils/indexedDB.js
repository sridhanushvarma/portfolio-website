/**
 * IndexedDB utility functions for storing and retrieving profile images and resumes
 * This ensures that changes made by admin are visible to all users
 */

const DB_NAME = 'PortfolioDB';
const DB_VERSION = 1;
const PROFILE_STORE = 'profileImages';
const RESUME_STORE = 'resumes';

/**
 * Initialize IndexedDB database
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database failed to open:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create profile images store
      if (!db.objectStoreNames.contains(PROFILE_STORE)) {
        db.createObjectStore(PROFILE_STORE, { keyPath: 'id' });
      }

      // Create resumes store
      if (!db.objectStoreNames.contains(RESUME_STORE)) {
        db.createObjectStore(RESUME_STORE, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Save profile image to IndexedDB
 * @param {string} imageData - Base64 encoded image data
 */
export const saveProfileImageToDB = async (imageData) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROFILE_STORE], 'readwrite');
    const store = transaction.objectStore(PROFILE_STORE);

    const profileData = {
      id: 'profile',
      data: imageData,
      timestamp: new Date().toISOString()
    };

    const request = store.put(profileData);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Profile image saved to IndexedDB');
        resolve(profileData);
      };
      request.onerror = () => {
        console.error('Error saving profile image:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in saveProfileImageToDB:', error);
    throw error;
  }
};

/**
 * Load profile image from IndexedDB
 * @returns {Promise<string|null>} Base64 encoded image data or null if not found
 */
export const loadProfileImageFromDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROFILE_STORE], 'readonly');
    const store = transaction.objectStore(PROFILE_STORE);

    const request = store.get('profile');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log('Profile image loaded from IndexedDB');
          resolve(result.data);
        } else {
          console.log('No profile image found in IndexedDB');
          resolve(null);
        }
      };
      request.onerror = () => {
        console.error('Error loading profile image:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in loadProfileImageFromDB:', error);
    return null;
  }
};

/**
 * Save resume to IndexedDB
 * @param {string} resumeData - Base64 encoded resume data
 * @param {string} fileName - Resume file name
 */
export const saveResumeToDB = async (resumeData, fileName) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RESUME_STORE], 'readwrite');
    const store = transaction.objectStore(RESUME_STORE);

    const resume = {
      id: 'resume',
      data: resumeData,
      fileName: fileName,
      timestamp: new Date().toISOString()
    };

    const request = store.put(resume);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Resume saved to IndexedDB');
        resolve(resume);
      };
      request.onerror = () => {
        console.error('Error saving resume:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in saveResumeToDB:', error);
    throw error;
  }
};

/**
 * Load resume from IndexedDB
 * @returns {Promise<{data: string, fileName: string}|null>} Resume data and file name or null if not found
 */
export const loadResumeFromDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([RESUME_STORE], 'readonly');
    const store = transaction.objectStore(RESUME_STORE);

    const request = store.get('resume');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log('Resume loaded from IndexedDB');
          resolve({
            data: result.data,
            fileName: result.fileName
          });
        } else {
          console.log('No resume found in IndexedDB');
          resolve(null);
        }
      };
      request.onerror = () => {
        console.error('Error loading resume:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in loadResumeFromDB:', error);
    return null;
  }
};

