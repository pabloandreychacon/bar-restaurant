import { useTranslation } from 'react-i18next';
import { Trophy, Users, Tv, GlassWater } from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: <Tv />, label: 'Pantallas Gigantes', value: '15+' },
    { icon: <Users />, label: 'Capacidad Fanáticos', value: '250+' },
    { icon: <Trophy />, label: 'Eventos en Vivo', value: 'Daily' },
    { icon: <GlassWater />, label: 'Cervezas Artesanales', value: '20+' },
  ];

  return (
    <div className="bg-stadium-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
          alt="About Header"
        />
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-6xl md:text-7xl font-display font-bold text-white tracking-tighter uppercase mb-6">
            MÁS QUE UN <span className="text-stadium-orange">BAR</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Nacimos de la pasión por el deporte y el deseo de crear el santuario definitivo para los verdaderos fanáticos.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">
              NUESTRA <span className="text-stadium-orange">HISTORIA</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-lg">
              <p>
                Fundado en 2024, Barracos Bar surgió como un proyecto de amigos que no encontraban un lugar con la atmósfera adecuada para vivir los grandes eventos deportivos. Queríamos pantallas que te hicieran sentir en el campo, sonido que te pusiera la piel de gallina y comida que estuviera a la altura de la emoción.
              </p>
              <p>
                Hoy somos el punto de encuentro de referencia en la ciudad. Cada rincón de nuestro local está diseñado pensando en el confort del espectador, desde la acústica hasta la ubicación estratégica de nuestras 15+ pantallas Ultra HD.
              </p>
              <p>
                En Barracos Bar no solo servimos comida y bebida; servimos momentos inolvidables, gritos de gol compartidos y la camaradería que solo el deporte puede generar.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-stadium-orange/10 blur-3xl rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1574966739982-2b783cb1f5f3?q=80&w=2070&auto=format&fit=crop"
              alt="Team"
              className="relative rounded-sm border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-stadium-grey/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex p-4 bg-stadium-dark border border-white/5 rounded-full text-stadium-orange mb-6 group-hover:bg-stadium-orange group-hover:text-black transition-all transform group-hover:scale-110">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-display font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold uppercase tracking-tight mb-4">
            LA EXPERIENCIA <span className="text-stadium-orange">Barracos Bar</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            No somos solo un lugar para ver el partido. Somos el estadio fuera del estadio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Sonido Envolvente', desc: 'Sentirás cada contacto, cada grito y cada silbato como si estuvieras en la grada.', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop' },
            { title: 'Gastronomía Pro', desc: 'Nuestra cocina combina clásicos de estadio con ingredientes gourmet de primera.', img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=2069&auto=format&fit=crop' },
            { title: 'Comunidad Fan', desc: 'Un ambiente vibrante donde la rivalidad es sana y la pasión es compartida.', img: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=2070&auto=format&fit=crop' },
          ].map((item, i) => (
            <div key={i} className="group cursor-default">
              <div className="h-64 overflow-hidden rounded-sm mb-6 border border-white/5">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-stadium-orange transition-colors uppercase">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
