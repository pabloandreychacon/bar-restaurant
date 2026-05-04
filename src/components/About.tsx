import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getSettings } from '../utils/settings';

const About = () => {
  const [businessName, setBusinessName] = useState('Barracos Bar');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings?.businessName) {
          setBusinessName(settings.businessName);
        }
      } catch (error) {
        console.error('Error fetching settings for about:', error);
      }
    };
    fetchSettings();
  }, []);

  const reviews = [
    {
      id: 1,
      name: "CARLOS 'EL TORO' R.",
      role: `FANÁTICO DE ${businessName}`,
      text: `¡La mejor atmósfera para ver la Champions! Las alitas con salsa ${businessName} son de otro planeta.`,
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=carlos"
    },
    {
      id: 2,
      name: "SOFÍA MÉNDEZ",
      role: `SOCIA VIP ${businessName}`,
      text: "El servicio es rapidísimo incluso cuando el bar está a reventar. ¡Gritar un gol aquí es único!",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=sofia"
    }
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574966739982-2b783cb1f5f3?q=80&w=2070&auto=format&fit=crop"
  ];

  return (
    <section className="py-24 bg-stadium-dark relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.02] text-[20vw] font-display font-bold whitespace-nowrap select-none pointer-events-none uppercase">
        {businessName}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter uppercase">
            ESTADIO <span className="text-stadium-orange">{businessName}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Step into the {businessName} experience. High-octane energy meets VIP sophistication in every corner of our arena.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-sm group">
            <img src={gallery[0]} alt="Stadium" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="overflow-hidden rounded-sm group aspect-square">
            <img src={gallery[1]} alt="Bar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="overflow-hidden rounded-sm group aspect-square">
            <img src={gallery[2]} alt="Lounge" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="overflow-hidden rounded-sm group aspect-square">
            <img src={gallery[3]} alt="Beer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="overflow-hidden rounded-sm group aspect-square">
            <img src={gallery[4]} alt="Wings" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-display font-bold text-stadium-orange tracking-tighter uppercase mb-12">
            GRITOS DE GOL
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-stadium-grey/50 p-8 rounded-sm border border-white/5 text-left relative group hover:border-stadium-orange/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-stadium-orange text-stadium-orange" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-8 text-lg">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{review.name}</h4>
                    <p className="text-[10px] text-stadium-orange font-bold tracking-widest uppercase">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
