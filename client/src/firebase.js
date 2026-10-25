import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBZZw1FZI4KCR06-Sc3a_orOIPNdxs9_nQ",
  authDomain: "fir-4ebd2.firebaseapp.com",
  projectId: "fir-4ebd2",
  storageBucket: "fir-4ebd2.firebasestorage.app",
  messagingSenderId: "153017776801",
  appId: "1:153017776801:web:3ebd64be5ab58840e3cee0",
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key] || String(firebaseConfig[key]).includes('your_'));
const isFirebaseConfigured = missingKeys.length === 0;

let app = null;
let auth = null;
let googleProvider = null;

try {
  if (isFirebaseConfigured) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Persist session in localStorage so the user stays logged in across
    // page reloads, route changes, and after booking confirmation.
    setPersistence(auth, browserLocalPersistence).catch((err) =>
      console.error('Firebase persistence error:', err)
    );
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

if (!isFirebaseConfigured) {
  console.warn('Firebase Authentication is not configured yet. Add your Firebase project values to the client environment file.');
}

export { auth, googleProvider, isFirebaseConfigured, missingKeys };
export default app;
