import { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { defaultSettings, getSettings, getCurrencySymbol } from '../../utils/settings';
import { joinBilingualText, splitBilingualText } from '../../utils/bilingual';

interface Product {
  Id?: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId?: number;
  ImageUrl: string;
  IsService: boolean;
  IsOffer?: boolean;
  Active: boolean;
  IdBusiness: number;
}

interface Category {
  Id: number;
  Name: string;
  DisplayName: string;
  Active: boolean;
  IdBusiness: number;
}

export function AdminProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState('CRC');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    NameEs: '',
    NameEn: '',
    DescriptionEs: '',
    DescriptionEn: '',
    Price: '',
    CategoryId: '',
    ImageUrl: '',
    IsOffer: false,
    Active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      setCurrencyCode(settings?.currencyCode || 'CRC');

      const [prodRes, catRes] = await Promise.all([
        supabase.from('Products').select('*').eq('IdBusiness', defaultSettings.id).order('Name'),
        supabase.from('Categories').select('*').eq('IdBusiness', defaultSettings.id).order('Name')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    const { es: nameEs, en: nameEn } = splitBilingualText(product.Name);
    const { es: descEs, en: descEn } = splitBilingualText(product.Description);

    setEditingProduct(product);
    setFormData({
      NameEs: nameEs,
      NameEn: nameEn,
      DescriptionEs: descEs,
      DescriptionEn: descEn,
      Price: product.Price.toString(),
      CategoryId: product.CategoryId?.toString() || '',
      ImageUrl: product.ImageUrl,
      IsOffer: product.IsOffer || false,
      Active: product.Active
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('postore')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('postore')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, ImageUrl: publicUrl }));
    } catch (err) {
      console.error('Error uploading:', err);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.deleteProduct'))) return;
    try {
      const { error } = await supabase.from('Products').delete().eq('Id', id);
      if (error) throw error;
      loadData();
    } catch (err) {
      alert(t('admin.deleteProduct'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      Name: joinBilingualText(formData.NameEs, formData.NameEn),
      Description: joinBilingualText(formData.DescriptionEs, formData.DescriptionEn),
      Price: parseFloat(formData.Price),
      CategoryId: formData.CategoryId ? parseInt(formData.CategoryId) : undefined,
      ImageUrl: formData.ImageUrl,
      IsService: false,
      IsOffer: formData.IsOffer,
      Active: formData.Active,
      IdBusiness: defaultSettings.id
    };

    try {
      if (editingProduct?.Id) {
        const { error } = await supabase.from('Products').update(productData).eq('Id', editingProduct.Id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('Products').insert([productData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err) {
      alert(t('admin.saveError'));
    }
  };

  return (
    <div className="mt-16 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Package className="text-stadium-orange" />
          {t('Products').toUpperCase()}
        </h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              NameEs: '', NameEn: '', DescriptionEs: '', DescriptionEn: '',
              Price: '', CategoryId: '', ImageUrl: '', IsOffer: false, Active: true
            });
            setIsModalOpen(true);
          }}
          className="bg-stadium-orange text-black px-4 py-2 rounded-sm font-bold flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={20} />
          {t('admin.newProduct').toUpperCase()}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.Id} className="bg-stadium-grey border border-white/5 rounded-sm overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                <img src={product.ImageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} alt={product.Name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleEdit(product)} className="p-2 bg-black/60 text-white hover:bg-stadium-orange hover:text-black rounded-sm backdrop-blur-sm transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => product.Id && handleDelete(product.Id)} className="p-2 bg-black/60 text-white hover:bg-red-600 rounded-sm backdrop-blur-sm transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                {!product.Active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">{t('admin.inactive')}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{splitBilingualText(product.Name).es}</h3>
                <p className="text-stadium-orange font-bold">{getCurrencySymbol(currencyCode)} {product.Price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stadium-grey w-full max-w-2xl border border-stadium-orange/30 rounded-sm p-8 my-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold uppercase">{editingProduct ? t('admin.editProduct') : t('admin.newProduct')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.nameEs')}</label>
                  <input required value={formData.NameEs} onChange={e => setFormData({ ...formData, NameEs: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-2 focus:border-stadium-orange outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.nameEn')}</label>
                  <input required value={formData.NameEn} onChange={e => setFormData({ ...formData, NameEn: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-2 focus:border-stadium-orange outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.descriptionEs')}</label>
                <textarea value={formData.DescriptionEs} onChange={e => setFormData({ ...formData, DescriptionEs: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-2 focus:border-stadium-orange outline-none h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.price')}</label>
                  <input type="number" step="0.01" required value={formData.Price} onChange={e => setFormData({ ...formData, Price: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-2 focus:border-stadium-orange outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('admin.category')}</label>
                  <select required value={formData.CategoryId} onChange={e => setFormData({ ...formData, CategoryId: e.target.value })} className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-2 focus:border-stadium-orange outline-none">
                    <option value="">{t('admin.selectCategory')}</option>
                    {categories.map(c => <option key={c.Id} value={c.Id}>{c.DisplayName}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                  <Upload size={14} className="text-stadium-orange" />
                  {t('admin.productImage')}
                </label>

                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`relative border-2 border-dashed rounded-sm p-8 transition-all flex flex-col items-center justify-center gap-4 ${isDragging ? 'border-stadium-orange bg-stadium-orange/10' : 'border-white/10 hover:border-white/20 bg-stadium-dark'
                    }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stadium-orange"></div>
                      <span className="text-xs font-bold text-stadium-orange uppercase">{t('admin.uploading')}</span>
                    </div>
                  ) : formData.ImageUrl ? (
                    <div className="relative group w-full aspect-video rounded-sm overflow-hidden">
                      <img src={formData.ImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="bg-stadium-orange text-black p-2 rounded-sm cursor-pointer hover:bg-white transition-all">
                          <Edit2 size={16} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, ImageUrl: '' }))}
                          className="bg-red-600 text-white p-2 rounded-sm hover:bg-red-700 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white mb-1">{t('admin.dragImage')}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t('admin.clickToBrowse')}</p>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-6 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.IsOffer} onChange={e => setFormData({ ...formData, IsOffer: e.target.checked })} className="accent-stadium-orange" />
                  <span className="text-sm font-bold uppercase tracking-wider">{t('admin.offer')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.Active} onChange={e => setFormData({ ...formData, Active: e.target.checked })} className="accent-stadium-orange" />
                  <span className="text-sm font-bold uppercase tracking-wider">{t('admin.active')}</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-stadium-orange text-black font-bold py-4 rounded-sm hover:bg-white transition-all mt-6 uppercase tracking-widest">
                {t('admin.saveProduct')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
