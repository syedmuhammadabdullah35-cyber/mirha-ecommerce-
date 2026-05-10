import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '../../components/ImageUploader';

interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  order: number;
}

export function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    title: 'Unstitched <br /> Lawn Collection',
    subtitle: 'Shop Now',
    buttonText: 'View Collections',
    order: 0
  });

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      setBanners(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      imageUrl: '',
      title: 'Unstitched <br /> Lawn Collection',
      subtitle: '',
      buttonText: 'View Collections',
      order: banners.length
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      imageUrl: banner.imageUrl,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      buttonText: banner.buttonText || 'View Collections',
      order: banner.order
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      alert('Please provide an image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBanner) {
        await fetch(`/api/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      fetchBanners();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await fetch(`/api/banners/${id}`, { method: 'DELETE' });
        fetchBanners();
      } catch (error) {
        alert('Failed to delete.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Home Slider Banners</h2>
        <button 
          onClick={openAddModal}
          className="bg-brand-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 text-sm font-bold uppercase tracking-widest hover:bg-brand-gold transition-all"
        >
          <Plus size={18} />
          <span>New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((b) => (
          <div key={b.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm group">
            {/* Height and fit fix for mobile banners */}
            <div className="aspect-[16/9] md:aspect-auto md:h-48 relative bg-gray-50 flex items-center justify-center">
              <img 
                src={b.imageUrl} 
                alt="" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-bold truncate">{b.title}</p>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(b)} className="p-2 bg-white rounded-full text-brand-dark shadow-lg hover:text-brand-gold"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(b.id)} className="p-2 bg-white rounded-full text-brand-dark shadow-lg hover:text-brand-accent"><Trash2 size={16} /></button>
              </div>
              <div className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">
                Order {b.order}
              </div>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{b.subtitle}</p>
            </div>
          </div>
        ))}
        {banners.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
             <ImageIcon className="mx-auto text-gray-200 mb-4" size={48} />
             <p className="text-gray-400 italic">No custom banners yet. Using defaults.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold">{editingBanner ? 'Edit Banner' : 'New Hero Banner'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500">Banner Image</label>
                <ImageUploader 
                  currentImage={formData.imageUrl}
                  onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                />
                {formData.imageUrl && (
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <p className="text-[10px] text-brand-dark font-bold uppercase tracking-widest">Image Ready</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Title</label>
                  <input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full p-3 border rounded-lg text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Subtitle</label>
                  <input 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                    className="w-full p-3 border rounded-lg text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Button Text</label>
                  <input 
                    value={formData.buttonText} 
                    onChange={e => setFormData({...formData, buttonText: e.target.value})} 
                    className="w-full p-3 border rounded-lg text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Order (Sequence)</label>
                  <input 
                    type="number"
                    value={formData.order} 
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
                    className="w-full p-3 border rounded-lg text-sm" 
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase text-xs flex items-center justify-center space-x-2">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                <span>{editingBanner ? 'Update Banner' : 'Publish Banner'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
