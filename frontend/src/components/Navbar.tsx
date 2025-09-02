import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isEmployer, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(isAuthenticated && isEmployer
      ? [
          { name: 'Post Job', path: '/post-job' } as const,
          { name: 'My Jobs', path: '/my-jobs' } as const,
        ]
      : []),
    ...(isAuthenticated && !isEmployer
      ? [
          { name: 'Find Jobs', path: '/jobs' } as const,
          { name: 'My Applications', path: '/my-applications' } as const,
        ]
      : []),
  ] as const;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
          : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                isScrolled 
                  ? 'from-indigo-600 to-blue-600 group-hover:from-indigo-700 group-hover:to-blue-700' 
                  : 'from-white to-blue-100 group-hover:from-white group-hover:to-blue-200'
              } transition-all duration-500`}>
                JobMatch
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-indigo-700 font-semibold'
                      : isScrolled
                      ? 'text-gray-700 hover:text-indigo-600'
                      : 'text-white/90 hover:text-white'
                  } group`}
                >
                  {link.name}
                  <span 
                    className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 transform -translate-x-1/2 ${
                      isActive ? 'w-4/5' : 'group-hover:w-4/5'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:ml-4 md:flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="group relative px-4 py-2 overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:from-red-600 hover:to-pink-700"
              >
                <span className="relative z-10 flex items-center">
                  <svg 
                    className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:translate-x-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border border-indigo-100 hover:border-indigo-200'
                      : 'text-white hover:bg-white/10 border border-white/20 hover:border-white/30'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm font-medium shadow-lg overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-all duration-200 hover:bg-white/10"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className={`block h-6 w-6 transition-transform duration-200 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6 text-gray-700 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-white shadow-xl rounded-b-xl overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg mx-2 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg mx-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg mx-2 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 mx-2 rounded-lg text-center text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
