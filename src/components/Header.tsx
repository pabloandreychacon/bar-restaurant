import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, User } from 'lucide-react';
import { getSettings } from '../utils/settings';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [businessName, setBusinessName] = useState('Barracos Bar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings?.businessName) {
          setBusinessName(settings.businessName);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.menu'), path: '/menu' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <header className="bg-black text-white fixed w-full top-0 z-40 border-b border-stadium-orange/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Business Name */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <img src="/favicon.svg" alt="Martini Logo" className="w-full h-full object-contain" />
            </div>
            <div className="font-display text-2xl font-bold tracking-tighter uppercase text-white">
              {loading ? '...' : businessName}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-stadium-orange no-underline ${location.pathname === link.path ? 'text-stadium-orange' : 'text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-[10px] font-bold border border-white/20 px-2 py-1 rounded-sm hover:border-stadium-orange hover:text-stadium-orange transition-all uppercase"
            >
              <Globe size={12} />
              {i18n.language}
            </button>

            <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
              <User size={18} />
            </Link>

            <Link
              to="/contact"
              className="bg-stadium-orange text-black px-5 py-2 rounded-sm font-bold text-xs hover:bg-white transition-all uppercase tracking-widest"
            >
              {t('hero.reservations')}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded-sm uppercase"
            >
              {i18n.language}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-stadium-orange transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-black border-b border-stadium-orange/20 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 bg-stadium-dark shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-4 text-base font-bold uppercase tracking-widest border-b border-white/5 ${location.pathname === link.path ? 'text-stadium-orange' : 'text-white'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-4 text-base font-bold uppercase tracking-widest border-b border-white/5 text-gray-400"
          >
            {t('nav.login')}
          </Link>
          <div className="pt-6 px-3">
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full bg-stadium-orange text-black text-center py-4 rounded-sm font-bold uppercase tracking-widest shadow-lg shadow-stadium-orange/20"
            >
              {t('hero.reservations')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
