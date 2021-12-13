import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { FIREBASE_KEY, FIREBASE_PROJECT_ID } from 'constants/index';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  apiKey: FIREBASE_KEY,
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: `${FIREBASE_PROJECT_ID}`,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
