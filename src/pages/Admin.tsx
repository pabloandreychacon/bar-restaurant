import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Layers, Settings, LogOut, Lock, Table } from 'lucide-react';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminSettings } from '../components/admin/AdminSettings';
import AdminTables from '../components/admin/AdminTables';
import { getSettings } from '../utils/settings';
import bcrypt from 'bcryptjs';

const Admin = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings' | 'tables'>('products');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const settings = await getSettings();
      if (!settings) throw new Error('No se pudo cargar la configuración');

      const isValid = bcrypt.compareSync(password, settings.onlinePassword);

      if (isValid) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
      } else {
        setError(t('admin.wrongPassword'));
      }
    } catch (err) {
      setError(t('admin.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-stadium-dark pt-20">
        <div className="max-w-md w-full bg-stadium-grey p-10 rounded-sm border border-stadium-orange/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-stadium-orange/10 mb-4">
              <Lock className="text-stadium-orange" size={32} />
            </div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tighter">Admin <span className="text-stadium-orange">Login</span></h2>
            <p className="text-gray-400 text-sm mt-2">{t('admin.restrictedArea')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{t('admin.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none transition-all text-white"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold bg-red-500/10 p-3 rounded-sm border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stadium-orange text-black font-bold py-4 rounded-sm hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? t('admin.verifying').toUpperCase() : t('admin.enterStadium').toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-stadium-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-stadium-grey border-r border-white/5 flex-col sticky top-0 self-start h-screen">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-display font-bold text-white tracking-tighter">
            ADMIN<span className="text-stadium-orange">PANEL</span>
          </h2>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-stadium-orange text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Package size={18} />
            PRODUCTOS
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-all ${activeTab === 'categories' ? 'bg-stadium-orange text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Layers size={18} />
            CATEGORÍAS
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-all ${activeTab === 'tables' ? 'bg-stadium-orange text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Table size={18} />
            MESAS
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-stadium-orange text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Settings size={18} />
            CONFIGURACIÓN
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            {t('admin.logout').toUpperCase()}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 lg:p-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'tables' && <AdminTables />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-stadium-grey border-t border-white/10 flex justify-around items-center z-50 pb-safe">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center justify-center py-3 px-1 flex-1 transition-all ${activeTab === 'products' ? 'text-stadium-orange' : 'text-gray-400'
            }`}
        >
          <Package size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">Productos</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center justify-center py-3 px-1 flex-1 transition-all ${activeTab === 'categories' ? 'text-stadium-orange' : 'text-gray-400'
            }`}
        >
          <Layers size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">Categorías</span>
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex flex-col items-center justify-center py-3 px-1 flex-1 transition-all ${activeTab === 'tables' ? 'text-stadium-orange' : 'text-gray-400'
            }`}
        >
          <Table size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">Mesas</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-3 px-1 flex-1 transition-all ${activeTab === 'settings' ? 'text-stadium-orange' : 'text-gray-400'
            }`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">Config</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-3 px-1 flex-1 text-red-500 transition-all"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">Salir</span>
        </button>
      </nav>
    </div>
  );
};

export default Admin;