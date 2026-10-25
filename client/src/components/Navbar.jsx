import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = Boolean(user);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold tracking-tighter ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Luxe<span className="text-yellow-500">Stay</span>
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Destinations', path: '/destinations' },
              { name: 'Hotels', path: '/hotels' },
              { name: 'Offers', path: '/offers' }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`text-lg font-medium hover:text-yellow-500 transition-colors ${
                    isScrolled ? 'text-gray-700' : 'text-gray-200'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className={`font-semibold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    Hello, {displayName}
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      isScrolled
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-red-500/80 text-white backdrop-blur-sm hover:bg-red-600'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                    isScrolled
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <FaUserCircle size={18} />
                  Sign In
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-xl absolute w-full left-0 top-full"
        >
          <div className="px-4 py-6 space-y-4 flex flex-col">
            {['Home', 'Destinations', 'Hotels', 'Offers'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-800 font-medium text-lg border-b border-gray-100 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-800 font-medium text-lg border-b border-gray-100 pb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logoutHandler(); setMobileMenuOpen(false); }}
                  className="bg-red-500 text-white text-center py-3 rounded-lg font-bold mt-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-500 text-white text-center py-3 rounded-lg font-bold mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
