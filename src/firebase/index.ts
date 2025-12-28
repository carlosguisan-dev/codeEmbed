'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      const app = initializeApp();
      return getSdks(app);
    } catch (e) {
      // This is the normal flow for local development
      const app = initializeApp(firebaseConfig);
      
      // Connect to emulators in local development
      if (process.env.NODE_ENV === 'development') {
        const auth = getAuth(app);
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

        const firestore = getFirestore(app);
        connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
      }
      return getSdks(app);
    }
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export type { UserProviderProps } from './auth/use-user';
export { UserProvider } from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';