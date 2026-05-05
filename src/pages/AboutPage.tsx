import { Trophy, Users, Tv, GlassWater } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: <Tv />, label: t('about.stats.screens'), value: '15+' },
    { icon: <Users />, label: t('about.stats.capacity'), value: '250+' },
    { icon: <Trophy />, label: t('about.stats.events'), value: 'Daily' },
    { icon: <GlassWater />, label: t('about.stats.beers'), value: '20+' },
  ];

  return (
    <div className="bg-stadium-dark min-h-screen">
      {/* Header Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden group">
        <div className="absolute bg-black/70 z-10" />
        <img
          src="/images/interior.png"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom transition-transform duration-500 group-hover:scale-110"
          alt="About Header"
        />
        <div className="relative z-20 text-center max-w-4xl px-4 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-display font-bold text-white tracking-tighter uppercase">
            {t('about.title')} <span className="text-stadium-orange">{t('about.titleHighlight')}</span>
          </h1>
          <div className="h-1 w-24 bg-stadium-orange mx-auto mt-4 mb-6" />
          <p className="text-xl text-gray-300 font-medium">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">
              {t('about.history')} <span className="text-stadium-orange">{t('about.historyHighlight')}</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-lg">
              <p>
                {t('about.story1')}
              </p>
              <p>
                {t('about.story2')}
              </p>
              <p>
                {t('about.story3')}
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-stadium-orange/10 blur-3xl rounded-full" />
            <div className="relative">
              <h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-4">
                {t('about.ourTeam')}
              </h3>
              <img
                src="/images/team.png"
                alt={t('about.ourTeam')}
                className="rounded-sm border border-white/10 shadow-2xl w-full object-cover"
              />
            </div>
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
            {t('about.experience')} <span className="text-stadium-orange">{t('about.experienceHighlight')}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('about.experienceSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('about.features.sound.title'), desc: t('about.features.sound.desc'), img: '/images/sound.png' },
            { title: t('about.features.gastronomy.title'), desc: t('about.features.gastronomy.desc'), img: '/images/gastro.png' },
            { title: t('about.features.community.title'), desc: t('about.features.community.desc'), img: '/images/comunity.png' },
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
