import { MapPin, Utensils, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ReservationSteps = () => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      icon: <MapPin className="text-stadium-orange" />,
      title: t('reservationSteps.steps.step1.title'),
      description: t('reservationSteps.steps.step1.description')
    },
    {
      id: 2,
      icon: <Utensils className="text-stadium-orange" />,
      title: t('reservationSteps.steps.step2.title'),
      description: t('reservationSteps.steps.step2.description')
    },
    {
      id: 3,
      icon: <Zap className="text-stadium-orange" />,
      title: t('reservationSteps.steps.step3.title'),
      description: t('reservationSteps.steps.step3.description')
    }
  ];

  return (
    <section className="py-24 bg-stadium-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tighter">
            {t('reservationSteps.title')} <span className="text-stadium-orange">{t('reservationSteps.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('reservationSteps.subtitle')}
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
              <Link to="/contact#map" className="bg-stadium-orange text-black px-8 py-3 rounded-sm font-bold text-sm hover:bg-white transition-all">
                {t('reservationSteps.howToGetThere')}
              </Link>
              <Link to="/menu" className="border border-white/20 hover:border-stadium-orange text-white px-8 py-3 rounded-sm font-bold text-sm transition-all">
                {t('reservationSteps.viewMenu')}
              </Link>
            </div>
          </div>

          {/* <div className="relative">
            <div className="absolute -inset-4 bg-stadium-orange/10 blur-3xl rounded-full" />
            <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <div className="w-full h-[600px] bg-stadium-grey/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-stadium-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={48} className="text-stadium-orange" />
                  </div>
                  <p className="text-gray-400 font-medium">Bar Interior</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="bg-stadium-orange/20 p-2 rounded-sm">
                    <Clock size={24} className="text-stadium-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{t('reservationSteps.gameZone')}</h4>
                    <p className="text-sm text-gray-400 mb-2">{t('reservationSteps.address')}</p>
                    <p className="text-xs font-bold text-stadium-orange uppercase tracking-widest">
                      {t('reservationSteps.hours')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ReservationSteps;
