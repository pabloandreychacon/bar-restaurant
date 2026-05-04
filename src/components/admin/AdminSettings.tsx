import { useState, useEffect } from 'react';
import { Settings, Save, MapPin, Phone, Mail, Globe, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { defaultSettings } from '../../utils/settings';
import bcrypt from 'bcryptjs';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    BusinessName: '',
    Address: '',
    Phone: '',
    Email: '',
    MapLocation: '',
    CurrencyCode: 'CRC',
    NewPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('Settings')
        .select('*')
        .eq('Id', defaultSettings.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          BusinessName: data.BusinessName || '',
          Address: data.Address || '',
          Phone: data.Phone || '',
          Email: data.Email || '',
          MapLocation: data.MapLocation || '',
          CurrencyCode: data.CurrencyCode || 'CRC',
          NewPassword: ''
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updateData: any = {
        BusinessName: formData.BusinessName,
        Address: formData.Address,
        Phone: formData.Phone,
        Email: formData.Email,
        MapLocation: formData.MapLocation,
        CurrencyCode: formData.CurrencyCode
      };

      if (formData.NewPassword) {
        const salt = bcrypt.genSaltSync(10);
        updateData.OnlinePassword = bcrypt.hashSync(formData.NewPassword, salt);
      }

      const { error } = await supabase
        .from('Settings')
        .update(updateData)
        .eq('Id', defaultSettings.id);

      if (error) throw error;
      alert('Configuración guardada correctamente');
      setFormData(prev => ({ ...prev, NewPassword: '' }));
    } catch (err) {
      alert('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div></div>;

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-8">
        <Settings className="text-stadium-orange" />
        Configuración del Negocio
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 bg-stadium-grey border border-white/5 p-8 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-stadium-orange font-bold text-sm tracking-widest uppercase border-b border-white/10 pb-2">Información General</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Globe size={14}/> Nombre del Negocio</label>
              <input required value={formData.BusinessName} onChange={e => setFormData({...formData, BusinessName: e.target.value})} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><MapPin size={14}/> Dirección</label>
              <textarea required value={formData.Address} onChange={e => setFormData({...formData, Address: e.target.value})} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none h-24" />
            </div>
          </div>

          {/* Contact & Misc */}
          <div className="space-y-6">
            <h3 className="text-stadium-orange font-bold text-sm tracking-widest uppercase border-b border-white/10 pb-2">Contacto y Región</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Phone size={14}/> Teléfono</label>
                <input required value={formData.Phone} onChange={e => setFormData({...formData, Phone: e.target.value})} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Moneda</label>
                <select value={formData.CurrencyCode} onChange={e => setFormData({...formData, CurrencyCode: e.target.value})} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none">
                  <option value="CRC">CRC (₡)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Mail size={14}/> Email</label>
              <input type="email" required value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Lock size={14}/> Cambiar Contraseña Admin</label>
              <input type="password" placeholder="Dejar en blanco para mantener" value={formData.NewPassword} onChange={e => setFormData({...formData, NewPassword: e.target.value})} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-stadium-orange text-black font-bold py-4 rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
        >
          {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div> : <Save size={20} />}
          {saving ? 'GUARDANDO...' : 'GUARDAR CONFIGURACIÓN'}
        </button>
      </form>
    </div>
  );
}
