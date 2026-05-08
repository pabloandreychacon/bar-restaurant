import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getSettings } from '../utils/settings';
import { Anchor, Button, ProgressBar } from 'luna-components-library';

const Footer = () => {
  const { t } = useTranslation();
  const [businessName, setBusinessName] = useState('Barracos Bar');
  const [contactInfo, setContactInfo] = useState({
    email: 'reservas@Barracos Bar.com',
    phone: '(506) 4000-1234',
    address: 'Av. Principal de los Deportes, Edificio Barracos Bar'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          if (settings.businessName) {
            setBusinessName(settings.businessName);
          }
          setContactInfo({
            email: settings.email,
            phone: settings.phone,
            address: settings.address
          });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-stadium-orange font-bold text-sm tracking-widest mb-6 uppercase">
              {t('footer.follow')}
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-stadium-grey w-9 h-9 flex items-center justify-center rounded-full hover:bg-stadium-orange hover:text-black transition-all font-bold text-sm" aria-label="Facebook">
                F
              </a>
              <a href="#" className="bg-stadium-grey w-9 h-9 flex items-center justify-center rounded-full hover:bg-stadium-orange hover:text-black transition-all font-bold text-sm" aria-label="YouTube">
                Y
              </a>
              <a href="#" className="bg-stadium-grey w-9 h-9 flex items-center justify-center rounded-full hover:bg-stadium-orange hover:text-black transition-all font-bold text-sm" aria-label="Instagram">
                I
              </a>
              <a href="#" className="bg-stadium-grey w-9 h-9 flex items-center justify-center rounded-full hover:bg-stadium-orange hover:text-black transition-all font-bold text-sm" aria-label="TikTok">
                T
              </a>
            </div>
          </div>

        </div>

        {/* Qr Code */}
        <div className="flex justify-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data=https%3A%2F%2Fbarracosbar.netlify.app%2F&amp;qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L" alt="qr code" className='w-32 h-32' />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stadium-grey pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{t('footer.rights')}</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">Email: {contactInfo.email}</a>
            <span>Phone: {contactInfo.phone}</span>
            <span>Address: {contactInfo.address}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <p className="text-gray-500 text-xs">{t('footer.createdBy')} <Anchor /></p>
      </div>
    </footer>
  );
};

export default Footer;
