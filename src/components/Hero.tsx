import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSettings, defaultSettings, getCurrencySymbol } from '../utils/settings';
import { supabase } from '../lib/supabase';
import { parseBilingualText } from '../utils/bilingual';
import { Link } from 'react-router-dom';

interface Product {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  IsOffer: boolean;
}

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const nextSlide = () => {
    if (products.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const settings = await getSettings();
        setCurrencySymbol(getCurrencySymbol(settings?.currencyCode));

        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('IdBusiness', defaultSettings.id)
          .eq('Active', true)
          .eq('IsOffer', true);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching settings for hero:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (loading) {
    return (
      <section className="relative h-[85vh] w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {products.map((product, index) => (
        <div
          key={product.Id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <img
            src={product.ImageUrl || '/images/hero-1.png'}
            alt={parseBilingualText(product.Name, i18n.language as 'es' | 'en')}
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 border border-stadium-orange/50 px-3 py-1 rounded-sm bg-stadium-orange/10">
                  <span className="w-2 h-2 bg-stadium-orange animate-pulse rounded-full" />
                  <span className="text-[10px] font-bold tracking-widest text-stadium-orange uppercase">
                    {t('menu.offer')}
                  </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter uppercase">
                  {parseBilingualText(product.Name, i18n.language as 'es' | 'en').split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? 'text-stadium-orange block' : 'text-white block'}>
                      {word}
                    </span>
                  ))}
                </h1>

                <p className="text-3xl font-display font-bold text-stadium-orange">
                  {currencySymbol}{product.Price}
                </p>

                <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md leading-relaxed max-w-md">
                  {parseBilingualText(product.Description, i18n.language as 'es' | 'en')}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  {/* <button className="bg-stadium-orange text-black px-8 py-4 rounded-sm font-bold text-sm flex items-center gap-2 hover:bg-white transition-all group">
                    {t('hero.cta')}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button> */}
                  <Link to="/reservations" className="border border-white/20 hover:border-stadium-orange text-white px-8 py-4 rounded-sm font-bold text-sm transition-all bg-white/5 backdrop-blur-sm no-underline inline-block">
                    {t('hero.reservations')}
                  </Link>
                </div>
              </div>

              {/* Featured Image */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-stadium-orange/20 blur-2xl group-hover:bg-stadium-orange/30 transition-all rounded-full" />
                  <img
                    src={product.ImageUrl || '/images/placeholder.png'}
                    alt={product.Name}
                    className="relative w-80 h-80 object-cover rounded-sm shadow-2xl border-4 border-stadium-grey transform rotate-3 group-hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons - Moved to bottom right */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-2">
        <button
          onClick={prevSlide}
          className="p-3 bg-stadium-grey/80 hover:bg-stadium-orange hover:text-black transition-all rounded-sm border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 bg-stadium-grey/80 hover:bg-stadium-orange hover:text-black transition-all rounded-sm border border-white/10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicators - Centered */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-12 bg-stadium-orange' : 'w-6 bg-white/20 hover:bg-white/40'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
