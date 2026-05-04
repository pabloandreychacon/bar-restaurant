import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Music2 } from 'lucide-react';
import { getSettings } from '../utils/settings';

const Footer = () => {
  const { t } = useTranslation();
  const [businessName, setBusinessName] = useState('Barracos Bar');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings?.businessName) {
          setBusinessName(settings.businessName);
        }
      } catch (error) {
        console.error('Error fetching settings for footer:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-stadium-dark border-t border-stadium-orange/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 no-underline group mb-6">
              <div className="w-10 h-10 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <img src="/favicon.svg" alt="Martini Logo" className="w-full h-full object-contain" />
              </div>
              <div className="font-display text-3xl font-bold text-white tracking-tighter uppercase">
                {businessName}
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-stadium-orange font-bold text-sm tracking-widest mb-6 uppercase">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/menu" className="text-gray-400 hover:text-white transition-colors">{t('nav.menu')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.reservations')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Eventos Deportivos</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-stadium-orange font-bold text-sm tracking-widest mb-6 uppercase">
              {t('footer.follow')}
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-stadium-grey p-2 rounded-full hover:bg-stadium-orange hover:text-black transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="bg-stadium-grey p-2 rounded-full hover:bg-stadium-orange hover:text-black transition-all">
                <Music2 size={18} />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-stadium-orange font-bold text-sm tracking-widest mb-6 uppercase">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Cookies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accesibilidad</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stadium-grey pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="mailto:reservas@Barracos Bar.com" className="hover:text-white transition-colors">reservas@Barracos Bar.com</a>
            <span>(506) 4000-1234</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
