import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import { FIREBASE_KEY, FIREBASE_PROJECT_ID } from 'constants/env';

const firebaseConfig = {
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  apiKey: FIREBASE_KEY,
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: `${FIREBASE_PROJECT_ID}`,
  storageBucket: `${FIREBASE_PROJECT_ID}.dopex-otc.appspot.com`,
  messagingSenderId: '548992730505',
  appId: '1:548992730505:web:79e4087de0207dbcaf0d58',
  measurementId: 'G-NMKHBH9VZT',
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
