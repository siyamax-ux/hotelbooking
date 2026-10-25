import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute — gates children behind Firebase auth.
 *
 * The critical guard here is checking `loading` BEFORE checking `!user`.
 * Firebase's onAuthStateChanged is asynchronous: on any navigation (including
 * booking → dashboard), there is a brief window where `user` is null while
 * Firebase is reading the persisted session from localStorage.  Without the
 * loading guard, ProtectedRoute would see `user = null` and instantly redirect
 * to /login even though the user is fully logged in.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for Firebase to finish resolving the persisted session.
  // Show a spinner — never redirect while auth state is unknown.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
      </div>
    );
  }

  // Firebase has resolved — user is definitely not logged in.
  if (!user) {
    console.warn('[ProtectedRoute] No authenticated user. Redirecting to /login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated — render the page.
  return children;
};

export default ProtectedRoute;
