import { MapPin, Utensils, Zap, Clock } from 'lucide-react';

const ReservationSteps = () => {
  const steps = [
    {
      id: 1,
      icon: <MapPin className="text-stadium-orange" />,
      title: "1. LLEGA AL ESTADIO",
      description: "Estamos ubicados en el corazón de la zona deportiva. Contamos con amplio parqueo vigilado para tu comodidad."
    },
    {
      id: 2,
      icon: <Utensils className="text-stadium-orange" />,
      title: "2. PIDE TU MESA",
      description: "Nuestro equipo de anfitrionas te recibirá para asignarte el mejor lugar frente a nuestras pantallas gigantes."
    },
    {
      id: 3,
      icon: <Zap className="text-stadium-orange" />,
      title: "3. VIVE LA PASIÓN",
      description: "Disfruta de la mejor comida deportiva y cervezas heladas mientras apoyas a tu equipo favorito en vivo."
    }
  ];

  return (
    <section className="py-24 bg-stadium-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter">
            TU ASIENTO <span className="text-stadium-orange">RESERVADO</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La experiencia del estadio se vive mejor en Barracos Bar. Sigue estos pasos para asegurar tu lugar en la jugada más importante de la noche.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-stadium-grey rounded-sm border border-stadium-orange/20 flex items-center justify-center group-hover:bg-stadium-orange group-hover:text-black transition-all">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-stadium-orange transition-colors">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-stadium-orange text-black px-8 py-3 rounded-sm font-bold text-sm hover:bg-white transition-all">
                CÓMO LLEGAR →
              </button>
              <button className="border border-white/20 hover:border-stadium-orange text-white px-8 py-3 rounded-sm font-bold text-sm transition-all">
                VER LA CARTA
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-stadium-orange/10 blur-3xl rounded-full" />
            <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?q=80&w=2070&auto=format&fit=crop"
                alt="Bar Interior"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="bg-stadium-orange/20 p-2 rounded-sm">
                    <Clock size={24} className="text-stadium-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">ZONA DE JUEGO</h4>
                    <p className="text-sm text-gray-400 mb-2">Av. Principal de los Deportes, Edificio Barracos Bar</p>
                    <p className="text-xs font-bold text-stadium-orange uppercase tracking-widest">
                      Abierto todos los días de 12:00 PM a 2:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSteps;
