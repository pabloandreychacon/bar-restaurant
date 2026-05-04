import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSettings } from '../utils/settings';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop',
    title: 'THE ULTIMATE STADIUM BURGER',
    badge: 'LIMITED TIME OFFER',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    title: 'COLD BEER & BEST VIBES',
    badge: 'HAPPY HOUR 4PM - 7PM',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    title: 'CATCH EVERY GAME LIVE',
    badge: 'ULTRA HD SCREENS',
  }
];

const Hero = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [businessName, setBusinessName] = useState('Barracos Bar');

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings?.businessName) {
          setBusinessName(settings.businessName);
        }
      } catch (error) {
        console.error('Error fetching settings for hero:', error);
      }
    };
    fetchSettings();

    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 border border-stadium-orange/50 px-3 py-1 rounded-sm bg-stadium-orange/10">
                  <span className="w-2 h-2 bg-stadium-orange animate-pulse rounded-full" />
                  <span className="text-[10px] font-bold tracking-widest text-stadium-orange uppercase">
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter uppercase">
                  {slide.title.includes('Barracos Bar') ? (
                    slide.title.replace('Barracos Bar', businessName).split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? 'text-stadium-orange block' : 'text-white block'}>
                        {word}
                      </span>
                    ))
                  ) : (
                    slide.title.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? 'text-stadium-orange block' : 'text-white block'}>
                        {word}
                      </span>
                    ))
                  )}
                </h1>

                <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                  {t('hero.subtitle')}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="bg-stadium-orange text-black px-8 py-4 rounded-sm font-bold text-sm flex items-center gap-2 hover:bg-white transition-all group">
                    {t('hero.cta')}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border border-white/20 hover:border-stadium-orange text-white px-8 py-4 rounded-sm font-bold text-sm transition-all bg-white/5 backdrop-blur-sm">
                    {t('hero.reservations')}
                  </button>
                </div>
              </div>

              {/* Featured Image (Optional, based on screenshot) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-stadium-orange/20 blur-2xl group-hover:bg-stadium-orange/30 transition-all rounded-full" />
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop"
                    alt="Burger"
                    className="relative w-96 h-96 object-cover rounded-sm shadow-2xl border-4 border-stadium-grey transform -rotate-3 group-hover:rotate-0 transition-transform duration-500"
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

      {/* Indicators - Moved to bottom left */}
      <div className="absolute bottom-10 left-8 z-30 flex gap-3">
        {slides.map((_, index) => (
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
