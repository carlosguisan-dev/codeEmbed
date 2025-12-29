
import admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

// When running in a Google Cloud environment (like App Hosting or Cloud Functions),
// the SDK can automatically discover the service account credentials.
// We can simplify the initialization to just initializeApp() without arguments.
if (getApps().length === 0) {
  adminApp = initializeApp();
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
