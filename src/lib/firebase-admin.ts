import admin from 'firebase-admin';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // For production environments (like App Hosting), use the service account key from the environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
     adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Fallback for other Google Cloud environments
    adminApp = initializeApp();
  } else {
    // For local development, you might not have these env vars.
    // In a real project, you would use a service account file here or the Firebase Local Emulators.
    // For this environment, we will try to initialize with default creds,
    // which may work if you're logged into gcloud CLI.
    try {
        adminApp = initializeApp();
    } catch (e) {
        console.error("Firebase Admin initialization failed. Ensure you have set up your service account credentials correctly.", e);
        // We will throw an error here to make it clear that the admin SDK is not configured.
        // In a real app, you would have a more robust local setup (e.g., emulators).
        throw new Error("Could not initialize Firebase Admin SDK. Check your configuration.");
    }
  }
} else {
  adminApp = getApps()[0];
}


const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

export const getFirebaseAdmin = () => {
    return {
        db,
        auth,
    };
};
