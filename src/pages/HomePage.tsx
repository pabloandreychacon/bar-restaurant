import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import ReservationSteps from '../components/ReservationSteps';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { defaultSettings, getSettings, getCurrencySymbol } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';

interface Product {
  Id: number;
  Name: string;
  Price: number;
  ImageUrl: string;
  IsOffer: boolean;
}

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    const loadStars = async () => {
      try {
        const settings = await getSettings();
        setCurrencySymbol(getCurrencySymbol(settings?.currencyCode));

        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('IdBusiness', defaultSettings.id)
          .eq('Active', true)
          .eq('IsOffer', false)
          .limit(3);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading stars:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStars();
  }, []);

  return (
    <div className="animate-fade-in">
      <SEO
        title="Barracos Bar | Sports Bar & Restaurant"
        description="The ultimate sports bar & restaurant experience. Enjoy craft beers, delicious food, live sports on big screens, and a vibrant atmosphere."
      />
      <Hero />
      <About />
      <ReservationSteps />

      {/* Menu Preview Section */}
      <section className="py-24 bg-stadium-grey/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-12">
            {t('home.stars')} <span className="text-stadium-orange">{t('home.starsHighlight')}</span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {products.map((item) => (
                <div key={item.Id} className="bg-stadium-dark border border-white/5 rounded-sm overflow-hidden group hover:border-stadium-orange/30 transition-all">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.ImageUrl || '/images/placeholder.png'}
                      alt={parseBilingualText(item.Name, i18n.language as 'es' | 'en')}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{parseBilingualText(item.Name, i18n.language as 'es' | 'en')}</h3>
                    <p className="text-stadium-orange font-bold text-lg">{currencySymbol}{item.Price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/menu" className="bg-transparent border-2 border-stadium-orange text-stadium-orange px-10 py-3 rounded-sm font-bold hover:bg-stadium-orange hover:text-black transition-all inline-block">
            {t('home.viewFullMenu')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
