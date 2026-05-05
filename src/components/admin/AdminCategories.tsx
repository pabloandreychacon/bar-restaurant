import { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { defaultSettings } from '../../utils/settings';

interface Category {
  Id?: number;
  Name: string;
  DisplayName: string;
  Active: boolean;
  IdBusiness: number;
}

export function AdminCategories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    Name: '',
    DisplayName: '',
    Active: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Categories')
        .select('*')
        .eq('IdBusiness', defaultSettings.id)
        .order('Name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      Name: category.Name,
      DisplayName: category.DisplayName,
      Active: category.Active
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      ...formData,
      IdBusiness: defaultSettings.id
    };

    try {
      if (editingCategory?.Id) {
        const { error } = await supabase.from('Categories').update(categoryData).eq('Id', editingCategory.Id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('Categories').insert([categoryData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert(t('admin.saveError'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.deleteCategory'))) return;
    try {
      const { error } = await supabase.from('Categories').delete().eq('Id', id);
      if (error) throw error;
      loadCategories();
    } catch (err) {
      alert(t('admin.deleteError'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="text-stadium-orange" />
          <span className="truncate">{t('admin.categories')}</span>
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ Name: '', DisplayName: '', Active: true });
            setIsModalOpen(true);
          }}
          className="bg-stadium-orange text-black px-3 sm:px-4 py-2 rounded-sm font-bold flex items-center gap-2 hover:bg-white transition-all text-sm sm:text-base"
        >
          <Plus size={16} className="sm:size-20" />
          <span className="truncate">{t('admin.newCategory').toUpperCase()}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {categories.map((cat) => (
              <div key={cat.Id} className="bg-stadium-grey border border-white/5 rounded-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{cat.Name}</h4>
                    <p className="text-gray-400 text-sm truncate">{cat.DisplayName}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 hover:text-stadium-orange transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => cat.Id && handleDelete(cat.Id)} className="p-2 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${cat.Active ? 'bg-stadium-orange/20 text-stadium-orange' : 'bg-red-900/20 text-red-500'}`}>
                    {cat.Active ? t('admin.active') : t('admin.inactive')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-stadium-grey border border-white/5 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stadium-dark border-b border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <th className="px-6 py-4 text-left min-w-[150px]">{t('admin.internalName')}</th>
                    <th className="px-6 py-4 text-left min-w-[150px]">{t('admin.displayName')}</th>
                    <th className="px-6 py-4 text-center min-w-[100px]">{t('admin.active')}</th>
                    <th className="px-6 py-4 text-right min-w-[100px]">{t('admin.edit')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <tr key={cat.Id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <span className="truncate block">{cat.Name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="truncate block">{cat.DisplayName}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${cat.Active ? 'bg-stadium-orange/20 text-stadium-orange' : 'bg-red-900/20 text-red-500'}`}>
                          {cat.Active ? t('admin.active') : t('admin.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(cat)} className="p-2 hover:text-stadium-orange transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => cat.Id && handleDelete(cat.Id)} className="p-2 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stadium-grey w-full max-w-md border border-stadium-orange/30 rounded-sm p-4 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-display font-bold uppercase truncate">{editingCategory ? t('admin.editCategory') : t('admin.newCategory')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white flex-shrink-0">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.internalName')}</label>
                <input required value={formData.Name} onChange={e => setFormData({ ...formData, Name: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-3 sm:px-4 py-2 focus:border-stadium-orange outline-none text-sm" placeholder="ej. burgers" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.displayName')}</label>
                <input required value={formData.DisplayName} onChange={e => setFormData({ ...formData, DisplayName: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-3 sm:px-4 py-2 focus:border-stadium-orange outline-none text-sm" placeholder="ej. Hamburguesas" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={formData.Active} onChange={e => setFormData({ ...formData, Active: e.target.checked })} className="accent-stadium-orange" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{t('admin.active')}</span>
              </label>
              <button type="submit" className="w-full bg-stadium-orange text-black font-bold py-3 sm:py-4 rounded-sm hover:bg-white transition-all mt-6 uppercase tracking-widest text-sm">
                {t('admin.saveCategory')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
