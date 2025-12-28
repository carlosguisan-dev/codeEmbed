'use client';

import {
  Auth,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useAuth } from '../provider';

// Define the shape of the context value
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

// Create the context with an undefined initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define props for the provider component
interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps parts of the app that need user authentication state.
 * It listens to Firebase auth state changes and makes the user object, loading state,
 * and any errors available to its children.
 */
export const UserProvider = ({ children }: UserProviderProps) => {
  const auth = useAuth(); // Get the auth instance from the parent FirebaseProvider
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If there's no auth instance, we can't determine the user.
    if (!auth) {
        setLoading(false);
        // Optionally set an error to indicate a configuration issue.
        setError(new Error("Firebase Auth instance is not available. Make sure UserProvider is wrapped in a FirebaseProvider."));
        return;
    }

    // Subscribe to auth state changes.
    // onAuthStateChanged returns an unsubscribe function.
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Authentication Error:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  }, [auth]); // Re-run the effect if the auth instance changes.

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to access the authenticated user's state.
 * Throws an error if used outside of a UserProvider.
 * @returns {UserContextType} The user object, loading state, and error.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
