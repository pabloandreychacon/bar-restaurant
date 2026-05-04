import { supabase } from '../lib/supabase';

// Function to get currency symbol from currency code
export function getCurrencySymbol(currencyCode?: string): string {
  const currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'CRC': '₡',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'BRL': 'R$',
    'MXN': '$',
    'CAD': '$',
    'AUD': '$',
    'CHF': 'CHF',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'RUB': '₽',
    'KRW': '₩',
    'SGD': '$',
    'HKD': '$',
    'NZD': '$',
    'ZAR': 'R',
    'TRY': '₺'
  };

  return currencySymbols[currencyCode || ''] || currencyCode || '$';
}

export interface BusinessSettings {
  id: number;
  address: string;
  phone: string;
  email: string;
  hours: string;
  latitude: number;
  longitude: number;
  businessName?: string;
  onlinePassword: string;
  currencyCode?: string;
}

export const defaultSettings = {
  id: 12, // Updated to 12 as requested
  address: 'Av. Principal de los Deportes, Edificio Barracos Bar',
  phone: '(506) 4000-1234',
  email: 'reservas@Barracos Bar.com',
  hours: 'Monday - Sunday: 12:00 PM - 2:00 AM',
  latitude: 9.9281,
  longitude: -84.0907,
  businessName: 'Barracos Bar',
  onlinePassword: '$2b$10$A5ebESkKmtGBAqhO5IWQQuDEz3vMS1Txc18jK44RBzYX36XJU.6R6' // Hash for "d"
};

export async function getSettings(): Promise<BusinessSettings | null> {
  try {
    const { data } = await supabase
      .from('Settings')
      .select('Address, Phone, Email, MapLocation, BusinessName, OnlinePassword, CurrencyCode')
      .eq('Id', defaultSettings.id)
      .single();

    if (!data) {
      return {
        ...defaultSettings,
        onlinePassword: defaultSettings.onlinePassword
      } as BusinessSettings;
    }

    let latitude = defaultSettings.latitude;
    let longitude = defaultSettings.longitude;

    if (data.MapLocation) {
      const regex1 = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
      const match1 = data.MapLocation.match(regex1);

      if (match1) {
        latitude = parseFloat(match1[1]);
        longitude = parseFloat(match1[2]);
      }
    }

    return {
      id: defaultSettings.id,
      address: data.Address || defaultSettings.address,
      phone: data.Phone || defaultSettings.phone,
      email: data.Email || defaultSettings.email,
      hours: defaultSettings.hours,
      latitude,
      longitude,
      businessName: data.BusinessName || defaultSettings.businessName,
      onlinePassword: data.OnlinePassword || defaultSettings.onlinePassword,
      currencyCode: data.CurrencyCode || 'CRC'
    };
  } catch (err) {
    console.error('Error getting settings:', err);
    return defaultSettings as BusinessSettings;
  }
}
