import Hero from '../components/Hero';
import About from '../components/About';
import ReservationSteps from '../components/ReservationSteps';

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <About />
      <ReservationSteps />
      
      {/* Menu Preview Section */}
      <section className="py-24 bg-stadium-grey/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-12">
            NUESTRAS <span className="text-stadium-orange">ESTRELLAS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { name: 'Wings Combo', price: '$12.99', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=2000&auto=format&fit=crop' },
              { name: 'Stadium Burger', price: '$15.99', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop' },
              { name: 'Craft Beer Flight', price: '$10.99', img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=2070&auto=format&fit=crop' },
            ].map((item, i) => (
              <div key={i} className="bg-stadium-dark border border-white/5 rounded-sm overflow-hidden group hover:border-stadium-orange/30 transition-all">
                <div className="h-64 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-stadium-orange font-bold text-lg">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="bg-transparent border-2 border-stadium-orange text-stadium-orange px-10 py-3 rounded-sm font-bold hover:bg-stadium-orange hover:text-black transition-all">
            VER MENÚ COMPLETO
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
