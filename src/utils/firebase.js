/**
 * Firebase configuration and utility functions
 * This file handles all Firebase operations for storing and retrieving
 * profile images and resumes from Firebase Realtime Database
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

// Firebase configuration
// These values should be replaced with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check if Firebase configuration is complete
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value && value.trim && value.trim() !== '');

// Initialize Firebase
let app;
let database;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    console.warn('Firebase is not properly configured. Profile photo and resume uploads will not work.');
  }
} else {
  console.warn('Firebase configuration is incomplete. Please set all required environment variables.');
  console.warn('See GITHUB_SECRETS_SETUP.md for instructions on setting up GitHub Secrets.');
}

/**
 * Save profile image to Firebase Realtime Database
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<void>}
 */
export const saveProfileImageToFirebase = async (imageData) => {
  try {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const profileRef = ref(database, 'portfolio/profileImage');
    await set(profileRef, {
      data: imageData,
      timestamp: new Date().toISOString(),
      updatedBy: 'admin'
    });

    console.log('Profile image saved to Firebase');
  } catch (error) {
    console.error('Error saving profile image to Firebase:', error);
    throw error;
  }
};

/**
 * Load profile image from Firebase Realtime Database
 * @returns {Promise<string|null>} Base64 encoded image data or null if not found
 */
export const loadProfileImageFromFirebase = async () => {
  try {
    if (!database) {
      console.warn('Firebase database not initialized');
      return null;
    }

    const profileRef = ref(database, 'portfolio/profileImage');
    const snapshot = await get(profileRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Profile image loaded from Firebase');
      return data.data;
    } else {
      console.log('No profile image found in Firebase');
      return null;
    }
  } catch (error) {
    console.error('Error loading profile image from Firebase:', error);
    return null;
  }
};

/**
 * Save resume to Firebase Realtime Database
 * @param {string} resumeData - Base64 encoded resume data
 * @param {string} fileName - Resume file name
 * @returns {Promise<void>}
 */
export const saveResumeToFirebase = async (resumeData, fileName) => {
  try {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const resumeRef = ref(database, 'portfolio/resume');
    await set(resumeRef, {
      data: resumeData,
      fileName: fileName,
      timestamp: new Date().toISOString(),
      updatedBy: 'admin'
    });

    console.log('Resume saved to Firebase');
  } catch (error) {
    console.error('Error saving resume to Firebase:', error);
    throw error;
  }
};

/**
 * Load resume from Firebase Realtime Database
 * @returns {Promise<{data: string, fileName: string}|null>} Resume data and file name or null if not found
 */
export const loadResumeFromFirebase = async () => {
  try {
    if (!database) {
      console.warn('Firebase database not initialized');
      return null;
    }

    const resumeRef = ref(database, 'portfolio/resume');
    const snapshot = await get(resumeRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Resume loaded from Firebase');
      return {
        data: data.data,
        fileName: data.fileName
      };
    } else {
      console.log('No resume found in Firebase');
      return null;
    }
  } catch (error) {
    console.error('Error loading resume from Firebase:', error);
    return null;
  }
};

export { database };

