import { useState, useEffect } from 'react';
import { Package, Layers, Settings, LogOut, Lock } from 'lucide-react';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminSettings } from '../components/admin/AdminSettings';
import { getSettings } from '../utils/settings';
import bcrypt from 'bcryptjs';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>('products');
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
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
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
            <p className="text-gray-400 text-sm mt-2">Área restringida para personal autorizado</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Contraseña</label>
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
              {loading ? 'VERIFICANDO...' : 'ENTRAR AL ESTADIO'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-stadium-dark pt-20 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-stadium-grey border-r border-white/5 flex flex-col fixed top-20 bottom-0 left-0 z-10">
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
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-12">
        <div className="">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
