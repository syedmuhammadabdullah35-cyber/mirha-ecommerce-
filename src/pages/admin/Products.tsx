import { useState, useEffect } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImageUploader } from '../../components/ImageUploader';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  category: z.enum(['Summer Lawn Collection', 'Summer Printed Lawn', 'Light Summer Unstitched']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  stockStatus: z.enum(['In Stock', 'Out of Stock']),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stockStatus: 'In Stock'
    }
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setImageUrls(['']);
    reset({
      title: '',
      price: 0,
      category: 'Summer Lawn Collection',
      description: '',
      stockStatus: 'In Stock'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setImageUrls(product.images || []);
    reset({
      title: product.title,
      price: product.price,
      category: product.category as any,
      description: product.description,
      stockStatus: product.stockStatus as any,
    });
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => setImageUrls([...imageUrls, '']);
  
  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };
  
  const handleRemoveImageUrl = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));

  const onSubmit = async (data: ProductFormData) => {
    const validImages = imageUrls.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      alert('Please add at least one image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        images: validImages,
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
        });
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (error) {
        alert('Failed to delete.');
      }
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif">Summer Collection Inventory</h2>
        <button 
          onClick={openAddModal}
          className="bg-brand-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 text-sm font-bold uppercase tracking-widest hover:bg-brand-gold transition-all"
        >
          <Plus size={18} />
          <span>New Summer Entry</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Product</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Price</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center space-x-4">
                  <img src={p.images[0]} alt="" className="h-10 w-10 object-cover rounded bg-gray-100" />
                  <span className="font-bold text-sm">{p.title}</span>
                </td>
                <td className="px-6 py-4 text-xs">{p.category}</td>
                <td className="px-6 py-4 font-bold text-sm">{formatPrice(p.price)}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openEditModal(p)} className="text-gray-400 hover:text-brand-gold"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-brand-accent"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && <div className="p-12 text-center text-gray-400 italic">No products found.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold">{editingProduct ? 'Edit Product' : 'Add Summer Product'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Title</label>
                  <input {...register('title')} className="w-full p-3 border rounded-lg text-sm" />
                  {errors.title && <p className="text-[10px] text-brand-accent">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Price (PKR)</label>
                  <input type="number" {...register('price', { valueAsNumber: true })} className="w-full p-3 border rounded-lg text-sm" />
                  {errors.price && <p className="text-[10px] text-brand-accent">{errors.price.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Category</label>
                  <select {...register('category')} className="w-full p-3 border rounded-lg text-sm">
                    <option value="Summer Lawn Collection">Lawn Collection</option>
                    <option value="Summer Printed Lawn">Summer Lawn Collection</option>
                    <option value="Light Summer Unstitched">Unstitched Collection</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Status</label>
                  <select {...register('stockStatus')} className="w-full p-3 border rounded-lg text-sm">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Description</label>
                <textarea {...register('description')} rows={3} className="w-full p-3 border rounded-lg text-sm" />
                {errors.description && <p className="text-[10px] text-brand-accent">{errors.description.message}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Inventory Images</label>
                  <button type="button" onClick={handleAddImageUrl} className="text-brand-gold text-[10px] font-bold">+ Add Row</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="space-y-2">
                       <ImageUploader 
                         currentImage={url}
                         onUpload={(newUrl) => handleImageUrlChange(idx, newUrl)}
                         className="aspect-square"
                       />
                       <div className="flex justify-end">
                        {imageUrls.length > 1 && <button type="button" onClick={() => handleRemoveImageUrl(idx)} className="text-brand-accent p-1 border rounded hover:bg-red-50"><Trash2 size={14} /></button>}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase text-xs flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>{editingProduct ? 'Update Inventory' : 'Save to Collection'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}