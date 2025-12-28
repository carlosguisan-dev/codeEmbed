import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const getFirebaseAdmin = () => {
    if (getApps().length > 0) {
        return {
            db: getFirestore(),
            auth: getAuth(),
        };
    }

    // This environment variable is automatically set by App Hosting.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        initializeApp();
    } else {
        // For local development, you might use a service account file.
        // Make sure to not commit this file to your repository.
        // const serviceAccount = require('../../../service-account-key.json');
        // initializeApp({
        //     credential: cert(serviceAccount),
        // });
        // As a fallback for local dev without a key file, we can try to initialize
        // with default credentials, which can work in some GCP environments.
        initializeApp();
    }

    return {
        db: getFirestore(),
        auth: getAuth(),
    };
};

export { getFirebaseAdmin };
