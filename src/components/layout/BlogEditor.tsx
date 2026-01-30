import React, { useState, useEffect } from 'react';
import  supabase  from '../../api/supabase';
import { useSelector } from 'react-redux';
import type{ RootState } from '../../app/store';

interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
  editId?: string | null; // Pass an ID if we are editing
  onSuccess: () => void;  // Refresh the list after saving
}

export const BlogEditor = ({ isOpen, onClose, editId, onSuccess }: BlogEditorProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch data if in Edit Mode
  useEffect(() => {
    if (isOpen && editId) {
      const fetchBlog = async () => {
        const { data } = await supabase.from('blogs').select('*').eq('id', editId).single();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setPreviewUrl(data.image_url);
        }
      };
      fetchBlog();
    } else if (isOpen) {
      // Reset state for "Create New"
      setTitle('');
      setContent('');
      setPreviewUrl('');
      setImageFile(null);
    }
  }, [isOpen, editId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let finalImageUrl = previewUrl;

      // Handle Image Upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        await supabase.storage.from('blog-images').upload(fileName, imageFile);
        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const blogData = {
        title,
        content,
        image_url: finalImageUrl,
        user_id: user.id,
        author_email: user.email,
        ...(editId && { id: editId })
      };

      const { error } = await supabase.from('blogs').upsert(blogData);
      if (error) throw error;

      onSuccess(); // Refresh the list
      onClose();   // Close the modal
    } catch (err) {
      console.error(err);
      alert("Error saving blog post.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl h-[90vh] border border-gray-100 shadow-2xl overflow-y-auto">
        
        <form onSubmit={handleSave} className="p-8 md:p-12 space-y-8">
          
          {/* Top Actions */}
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b border-gray-50">
            <button type="button" onClick={onClose} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black">
              Close
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white px-8 py-2 text-[10px] uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Publish Post'}
            </button>
          </div>

          {/* Cover Image Upload */}
          <div className="relative group w-full h-80 bg-gray-50 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] uppercase tracking-widest text-gray-300">Add Header Image</span>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }} 
            />
          </div>

          <input 
            type="text" 
            placeholder="Blog Title" 
            className="w-full text-5xl font-light focus:outline-none placeholder:text-gray-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea 
            placeholder="Write something unforgettable..." 
            className="w-full h-96 text-lg leading-relaxed focus:outline-none resize-none placeholder:text-gray-100"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </form>
      </div>
    </div>
  );
};