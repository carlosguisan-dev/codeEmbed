'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Define a type for the returned services for clarity.
type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

// This variable will hold the single instance of our Firebase services.
let firebaseServices: FirebaseServices | null = null;

// IMPORTANT: This function now ensures a SINGLETON pattern.
export function initializeFirebase(): FirebaseServices {
  // If the services have already been initialized, return the existing instance.
  if (firebaseServices) {
    return firebaseServices;
  }

  // Check if any Firebase app has been initialized.
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  // Create the services object and store it for future calls.
  firebaseServices = {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };

  return firebaseServices;
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