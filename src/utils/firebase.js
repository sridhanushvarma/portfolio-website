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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDvKvKvKvKvKvKvKvKvKvKvKvKvKvKvKvKvKv",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "portfolio-website-xxxxx.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://portfolio-website-xxxxx.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "portfolio-website-xxxxx",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "portfolio-website-xxxxx.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
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

