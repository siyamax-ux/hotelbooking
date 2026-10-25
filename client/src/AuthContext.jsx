import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';

const AuthContext = createContext(null);

const mapFirebaseError = (error) => {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found for that email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      setError('Firebase Authentication is not configured yet. Add your project credentials to the client environment file.');
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (authError) => {
        setError(mapFirebaseError(authError));
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const clearError = () => setError('');

  const signUp = async (email, password, displayName) => {
    clearError();
    if (!isFirebaseConfigured || !auth) {
      const configError = new Error('Firebase Authentication is not configured yet.');
      setError('Firebase Authentication is not configured yet. Add your project credentials to the client environment file.');
      throw configError;
    }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      return result.user;
    } catch (authError) {
      setError(mapFirebaseError(authError));
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    clearError();
    if (!isFirebaseConfigured || !auth) {
      const configError = new Error('Firebase Authentication is not configured yet.');
      setError('Firebase Authentication is not configured yet. Add your project credentials to the client environment file.');
      throw configError;
    }

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (authError) {
      setError(mapFirebaseError(authError));
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    clearError();
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      const configError = new Error('Firebase Authentication is not configured yet.');
      setError('Firebase Authentication is not configured yet. Add your project credentials to the client environment file.');
      throw configError;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (authError) {
      setError(mapFirebaseError(authError));
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    clearError();
    if (auth) {
      await signOut(auth);
    }
  };

  const resetPassword = async (email) => {
    clearError();
    if (!isFirebaseConfigured || !auth) {
      const configError = new Error('Firebase Authentication is not configured yet.');
      setError('Firebase Authentication is not configured yet. Add your project credentials to the client environment file.');
      throw configError;
    }

    await sendPasswordResetEmail(auth, email);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      setError,
      signUp,
      signIn,
      signInWithGoogle,
      logout,
      resetPassword,
      clearError,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
