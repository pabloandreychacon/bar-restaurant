import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSettings } from '../utils/settings';
import type { BusinessSettings } from '../utils/settings';

export default function WhatsAppButton() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const message = '¡Hola! Me gustaría obtener más información.';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings for WhatsApp button:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    if (settings?.phone) {
      const whatsappUrl = `https://wa.me/${settings.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!settings?.phone) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#128C7E] z-50 group"
      aria-label="Chatear por WhatsApp"
    >
      <MessageCircle size={32} />
      <span className="absolute right-16 bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
        ¿En qué podemos ayudarte?
      </span>
    </button>
  );
}
