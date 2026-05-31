import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export function ImageUploader({ onUpload, currentImage, className = "" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, 'products/' + Date.now() + '_' + file.name);
      
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      onUpload(url);
      setPreview(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please check your storage rules.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={`relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden group cursor-pointer hover:border-brand-gold transition-colors aspect-video flex items-center justify-center bg-gray-50 ${className}`}
      onClick={() => fileInputRef.current?.click()}
    >
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
          </div>
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-brand-dark hover:bg-white"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <div className="text-center p-6">
          <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
            <Upload className="text-gray-400" size={24} />
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest leading-relaxed">
            Drag & Drop or Click<br />to Upload from Gallery
          </p>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-gold" size={32} />
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
