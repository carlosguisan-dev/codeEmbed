'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This component is now simpler, as initializeFirebase handles the singleton logic.
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Directly call initializeFirebase. It will either create the instance
  // or return the existing one, preventing re-initializations on re-renders.
  const { firebaseApp, auth } = initializeFirebase();

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
