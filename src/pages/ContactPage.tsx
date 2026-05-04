import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, Clock } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'reservation',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
    setFormData({ name: '', email: '', phone: '', subject: 'reservation', message: '' });
  };

  return (
    <div className="bg-stadium-dark min-h-screen">
      {/* Header */}
      <section className="py-20 bg-stadium-grey/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter uppercase mb-4">
            RESERVA TU <span className="text-stadium-orange">LUGAR</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            No te quedes fuera del juego. Reserva tu mesa o envíanos tus dudas sobre eventos privados y celebraciones.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <MessageSquare className="text-stadium-orange" />
                Info de Contacto
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stadium-grey rounded-sm border border-white/5 flex items-center justify-center text-stadium-orange flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">Ubicación</h4>
                    <p className="text-gray-300">Av. Principal de los Deportes, Edificio Barracos Bar</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stadium-grey rounded-sm border border-white/5 flex items-center justify-center text-stadium-orange flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">Teléfono</h4>
                    <p className="text-gray-300">(506) 4000-1234</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stadium-grey rounded-sm border border-white/5 flex items-center justify-center text-stadium-orange flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">Email</h4>
                    <p className="text-gray-300">reservas@Barracos Bar.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <Clock className="text-stadium-orange" />
                Horario
              </h2>
              <div className="bg-stadium-grey/50 p-6 rounded-sm border border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lunes - Jueves</span>
                  <span className="font-bold">12:00 PM - 12:00 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Viernes - Sábado</span>
                  <span className="font-bold text-stadium-orange">12:00 PM - 02:00 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Domingo</span>
                  <span className="font-bold">12:00 PM - 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-stadium-grey p-10 rounded-sm border border-white/5 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stadium-orange/5 blur-3xl pointer-events-none" />

              <h2 className="text-3xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <Calendar className="text-stadium-orange" />
                Envíanos un Mensaje
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      placeholder="(506) 0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Asunto</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                    >
                      <option value="reservation">Reservación</option>
                      <option value="event">Evento Privado</option>
                      <option value="feedback">Sugerencias</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Mensaje / Detalles de Reserva</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                    placeholder="Cuéntanos más (fecha, hora, número de personas...)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-stadium-orange text-black font-bold py-4 rounded-sm hover:bg-white transition-all transform hover:scale-[1.01] active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <Send size={18} />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
