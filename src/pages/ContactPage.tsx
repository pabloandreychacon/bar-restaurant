import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSettings } from '../utils/settings';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'reservation',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    address: 'Av. Principal de los Deportes, Edificio Barracos Bar',
    phone: '(506) 4000-1234',
    email: 'reservas@Barracos Bar.com',
    latitude: 9.9281,
    longitude: -84.0907
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          setContactInfo({
            address: settings.address,
            phone: settings.phone,
            email: settings.email,
            latitude: settings.latitude,
            longitude: settings.longitude
          });
        }
      } catch (error) {
        console.error('Error fetching settings for contact page:', error);
      }
    };
    fetchSettings();

    // Manejar el scroll al mapa si el hash está presente
    if (window.location.hash === '#map') {
      const element = document.getElementById('map');
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      emailjs.init('L7o6hZUmFJQ_Jbqu0');
      await emailjs.send('service_s481rtv', 'template_771ecr6', {
        to_email: contactInfo.email,
        from_name: formData.name,
        from_email: formData.email,
        subject: `[${formData.subject}] Mensaje de ${formData.name}`,
        message: `Nombre: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\nAsunto: ${formData.subject}\n\nMensaje:\n${formData.message}`,
      });
      alert(t('contact.successMessage'));
      setFormData({ name: '', email: '', phone: '', subject: 'reservation', message: '' });
    } catch (error) {
      alert(t('contact.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stadium-dark min-h-screen">
      {/* Header Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="/images/hero-2.png"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom transition-transform duration-500 group-hover:scale-110"
          alt="Contact Header"
        />
        <div className="relative z-20 text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter uppercase">
            {t('contact.title')} <span className="text-stadium-orange">{t('contact.titleHighlight')}</span>
          </h1>
          <div className="h-1 w-24 bg-stadium-orange mx-auto mt-4" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <MessageSquare className="text-stadium-orange" />
                {t('contact.contactInfo')}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stadium-grey rounded-sm border border-white/5 flex items-center justify-center text-stadium-orange flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">{t('contact.location')}</h4>
                    <p className="text-gray-300">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stadium-grey rounded-sm border border-white/5 flex items-center justify-center text-stadium-orange flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">{t('contact.phone')}</h4>
                    <p className="text-gray-300">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stadium-grey rounded-sm border border-white/5 flex items-center justify-center text-stadium-orange flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">{t('contact.email')}</h4>
                    <p className="text-gray-300">{contactInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <Clock className="text-stadium-orange" />
                {t('contact.schedule')}
              </h2>
              <div className="bg-stadium-grey/50 p-6 rounded-sm border border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t('contact.mondayThursday')}</span>
                  <span className="font-bold">12:00 PM - 12:00 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t('contact.fridaySaturday')}</span>
                  <span className="font-bold text-stadium-orange">12:00 PM - 02:00 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t('contact.sunday')}</span>
                  <span className="font-bold">12:00 PM - 11:00 PM</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div id="map">
              <div className="rounded-sm overflow-hidden border border-white/10">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d766.125421148198!2d${contactInfo.longitude}!3d${contactInfo.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2scr!4v1763913695694!5m2!1ses!2scr`}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://www.google.com/maps/place/${contactInfo.latitude},${contactInfo.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stadium-orange hover:text-white transition-colors text-sm font-bold mt-3"
              >
                <ExternalLink size={14} />
                {t('contact.viewOnMap')}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-stadium-grey p-10 rounded-sm border border-white/5 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stadium-orange/5 blur-3xl pointer-events-none" />

              <h2 className="text-3xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <Calendar className="text-stadium-orange" />
                {t('contact.sendMessage')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('contact.fullName')}</label>
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
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('contact.emailLabel')}</label>
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
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('contact.phoneLabel')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      placeholder="(506) 0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('contact.subject')}</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                    >
                      <option value="reservation">{t('contact.reservation')}</option>
                      <option value="event">{t('contact.event')}</option>
                      <option value="feedback">{t('contact.feedback')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('contact.message')}</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stadium-orange text-black font-bold py-4 rounded-sm hover:bg-white transition-all transform hover:scale-[1.01] active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {isSubmitting ? t('contact.sending') : t('contact.sendMessageButton')}
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
