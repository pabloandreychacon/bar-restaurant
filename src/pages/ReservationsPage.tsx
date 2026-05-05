import { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Users, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAvailableTables, getAvailableTablesForDateTime, createReservation, deleteOldReservations, type RestaurantTable, type Reservation } from '../utils/reservations';
import { getSettings, defaultSettings } from '../utils/settings';
import emailjs from '@emailjs/browser';

// Converts "11:00 AM" to "11:00:00" (PostgreSQL time format)
const toPostgresTime = (time: string): string => {
  const [hourMin, period] = time.split(' ');
  let [hours, minutes] = hourMin.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

const ReservationsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: '2',
    specialRequests: '',
    tableId: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantEmail, setRestaurantEmail] = useState('');
  const [availableTables, setAvailableTables] = useState<RestaurantTable[]>([]);
  const [filteredTables, setFilteredTables] = useState<RestaurantTable[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const [tables, settings] = await Promise.all([getAvailableTables(defaultSettings.id), getSettings()]);
        setAvailableTables(tables);
        setFilteredTables(tables);
        if (settings?.email) setRestaurantEmail(settings.email);
        deleteOldReservations(defaultSettings.id);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);

  // Update filtered tables when date, startTime or endTime change
  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime) {
      const updateFilteredTables = async () => {
        setIsLoadingTables(true);
        try {
          const tables = await getAvailableTablesForDateTime(formData.date, toPostgresTime(formData.startTime), toPostgresTime(formData.endTime), defaultSettings.id);
          setFilteredTables(tables.filter(t => t.capacity >= parseInt(formData.guests)));
        } catch (error) {
          console.error('Error filtering tables:', error);
          setFilteredTables([]);
        } finally {
          setIsLoadingTables(false);
        }
      };
      updateFilteredTables();
    } else {
      setFilteredTables(availableTables.filter(t => t.capacity >= parseInt(formData.guests)));
    }
  }, [formData.date, formData.startTime, formData.endTime, formData.guests, availableTables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tableId) {
      alert(t('reservations.selectTableError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedTable = filteredTables.find(t => t.id_restaurant_table.toString() === formData.tableId);
      const reservation: Omit<Reservation, 'id_reservation'> = {
        id_restaurant_table: parseInt(formData.tableId),
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || undefined,
        date: formData.date,
        start_time: toPostgresTime(formData.startTime),
        end_time: toPostgresTime(formData.endTime),
        comments: formData.specialRequests || undefined
      };

      const result = await createReservation(reservation);
      if (result) {
        emailjs.init('L7o6hZUmFJQ_Jbqu0');
        await emailjs.send('service_s481rtv', 'template_771ecr6', {
          to_email: restaurantEmail,
          from_name: formData.name,
          from_email: formData.email,
          subject: `Nueva Reservación - ${formData.name} - ${formData.date}`,
          message: `NUEVA RESERVACIÓN\n\nCliente: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone || 'No indicado'}\n\nMesa: ${selectedTable ? `#${selectedTable.number} (${selectedTable.location})` : formData.tableId}\nPersonas: ${formData.guests}\nFecha: ${formData.date}\nHorario: ${formData.startTime} - ${formData.endTime}\n\nComentarios:\n${formData.specialRequests || 'Ninguno'}`,
        });
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', phone: '', date: '', startTime: '', endTime: '', guests: '2', specialRequests: '', tableId: '' });
        }, 3000);
      } else {
        alert(t('reservations.reservationError'));
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert(t('reservations.reservationError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  return (
    <div className="bg-stadium-dark min-h-screen">
      <SEO
        title="Reservations | Barracos Bar"
        description="Book your table at Barracos Bar. Make online reservations for game days, special events, or a night out with friends."
      />
      {/* Header Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="/images/comunity.png"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom transition-transform duration-500 group-hover:scale-110"
          alt="Reservations Header"
        />
        <div className="relative z-20 text-center max-w-4xl px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter uppercase">
            {t('reservations.title')} <span className="text-stadium-orange">{t('reservations.titleHighlight')}</span>
          </h1>
          <div className="h-1 w-24 bg-stadium-orange mx-auto mt-4 mb-6" />
          <p className="text-xl text-gray-300 font-medium">
            {t('reservations.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16">
          {/* Reservation Form */}
          <div className="lg:col-span-1">
            <div className="bg-stadium-grey p-10 rounded-sm border border-white/5 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stadium-orange/5 blur-3xl pointer-events-none" />

              <h2 className="text-3xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <Users className="text-stadium-orange" />
                {t('reservations.completeReservation')}
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-stadium-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} className="text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('reservations.reservationConfirmed')}</h3>
                  <p className="text-gray-400">{t('reservations.reservationConfirmedMessage')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.fullName')}</label>
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
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.emailLabel')}</label>
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
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.phoneLabel')}</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                        placeholder="(506) 0000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.numberOfPeople')}</label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      >
                        <option value="1">1 {t('reservations.person')}</option>
                        <option value="2">2 {t('reservations.people')}</option>
                        <option value="3">3 {t('reservations.people')}</option>
                        <option value="4">4 {t('reservations.people')}</option>
                        <option value="5">5 {t('reservations.people')}</option>
                        <option value="6">6 {t('reservations.people')}</option>
                        <option value="7">7 {t('reservations.people')}</option>
                        <option value="8">8+ {t('reservations.people')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.date')}</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.startTime')}</label>
                      <select
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value, endTime: '' })}
                        required
                        className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      >
                        <option value="">{t('reservations.selectTime')}</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div />
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.endTime')}</label>
                      <select
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                        disabled={!formData.startTime}
                        className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all disabled:opacity-40"
                      >
                        <option value="">{t('reservations.selectTime')}</option>
                        {timeSlots
                          .filter(time => !formData.startTime || toPostgresTime(time) > toPostgresTime(formData.startTime))
                          .map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.selectTable')}</label>
                    {formData.date && formData.startTime && formData.endTime ? (
                      isLoadingTables ? (
                        <div className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-8 text-center text-gray-400">
                          {t('reservations.loadingTables')}
                        </div>
                      ) : filteredTables.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredTables.map((table) => (
                            <div
                              key={table.id_restaurant_table}
                              className={`relative bg-stadium-dark border rounded-sm p-4 cursor-pointer transition-all ${formData.tableId === table.id_restaurant_table.toString()
                                ? 'border-stadium-orange bg-stadium-orange/10'
                                : 'border-white/10 hover:border-stadium-orange/50'
                                }`}
                              onClick={() => setFormData({ ...formData, tableId: table.id_restaurant_table.toString() })}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-white">{t('reservations.table')} {table.number}</span>
                                <span className="text-xs bg-stadium-grey px-2 py-1 rounded text-gray-300">
                                  {table.location}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400">
                                <Users size={14} className="inline mr-1" />
                                {table.capacity} {table.capacity === 1 ? t('reservations.person') : t('reservations.people')}
                              </div>
                              {formData.tableId === table.id_restaurant_table.toString() && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-stadium-orange rounded-full flex items-center justify-center">
                                  <Check size={12} className="text-black" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-8 text-center text-gray-400">
                          {t('reservations.noTablesAvailable')}
                        </div>
                      )
                    ) : (
                      <div className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-8 text-center text-gray-400">
                        {t('reservations.selectDateTime')}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('reservations.specialRequests')}</label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all"
                      placeholder={t('reservations.specialRequestsPlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stadium-orange text-black font-bold py-4 rounded-sm hover:bg-white transition-all transform hover:scale-[1.01] active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('reservations.sending') : t('reservations.confirmReservation')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
