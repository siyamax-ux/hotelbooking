import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from './AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading, error, setError, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, navigate, user]);

  const handleEmailSignUp = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(email, password, name);
      navigate('/dashboard', { replace: true });
    } catch {
      // error is already stored in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch {
      // error is already stored in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.22),_transparent_30%),linear-gradient(135deg,_#fcfbf7_0%,_#f7efe0_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-700">
            LuxeStay
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Create your LuxeStay account
          </h1>
          <p className="mt-3 text-sm text-stone-600">Reserve your next stay in just a few moments.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FcGoogle className="h-5 w-5" />
          <span>Continue with Google</span>
        </button>

        <div className="my-6 flex items-center gap-3 text-sm text-stone-500">
          <div className="h-px flex-1 bg-stone-200" />
          <span>Or continue with</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-5">
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-stone-700">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
              placeholder="Alex Morgan"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-stone-700">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-medium text-stone-700">
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#d4af37] px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-[#c89d1a] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 border-t border-stone-200 pt-6 text-center">
          <p className="text-sm text-stone-500">Already have an account?</p>
          <Link
            to="/login"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
