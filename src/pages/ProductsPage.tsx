import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { defaultSettings, getCurrencySymbol, getSettings } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';
import { Search, Filter, ShoppingBag } from 'lucide-react';

interface Product {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId: number;
  ImageUrl: string;
  IsOffer: boolean;
  Active: boolean;
}

interface Category {
  Id: number;
  Name: string;
  DisplayName: string;
  Active: boolean;
}

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      setCurrencySymbol(getCurrencySymbol(settings?.currencyCode));

      const [prodRes, catRes] = await Promise.all([
        supabase.from('Products').select('*').eq('IdBusiness', defaultSettings.id).eq('Active', true),
        supabase.from('Categories').select('*').eq('IdBusiness', defaultSettings.id).eq('Active', true)
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.CategoryId === selectedCategory;
    const matchesSearch = parseBilingualText(product.Name, i18n.language as 'es' | 'en')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-stadium-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Menu Header"
        />
        <div className="relative z-20 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter uppercase">
            NUESTRA <span className="text-stadium-orange">CARTA</span>
          </h1>
          <div className="h-1 w-24 bg-stadium-orange mx-auto mt-4" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${
                selectedCategory === 'all' 
                ? 'bg-stadium-orange text-black' 
                : 'bg-stadium-grey text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              TODOS
            </button>
            {categories.map(cat => (
              <button
                key={cat.Id}
                onClick={() => setSelectedCategory(cat.Id)}
                className={`px-6 py-2 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${
                  selectedCategory === cat.Id 
                  ? 'bg-stadium-orange text-black' 
                  : 'bg-stadium-grey text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.DisplayName}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar platillo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stadium-grey border border-white/5 rounded-sm pl-12 pr-4 py-3 focus:border-stadium-orange outline-none transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.Id} className="bg-stadium-grey border border-white/5 rounded-sm overflow-hidden group hover:border-stadium-orange/30 transition-all flex flex-col h-full">
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={product.ImageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={product.Name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.IsOffer && (
                    <div className="absolute top-4 left-4 bg-stadium-orange text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest animate-pulse">
                      OFERTA
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight uppercase">
                      {parseBilingualText(product.Name, i18n.language as 'es' | 'en')}
                    </h3>
                    <span className="text-stadium-orange font-bold text-lg whitespace-nowrap ml-2">
                      {currencySymbol}{product.Price}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {parseBilingualText(product.Description, i18n.language as 'es' | 'en')}
                  </p>
                  <button className="mt-auto w-full bg-transparent border border-white/20 text-white font-bold py-3 rounded-sm text-xs uppercase tracking-widest hover:bg-stadium-orange hover:text-black hover:border-stadium-orange transition-all flex items-center justify-center gap-2 group">
                    <ShoppingBag size={14} />
                    Añadir al Pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-sm">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
