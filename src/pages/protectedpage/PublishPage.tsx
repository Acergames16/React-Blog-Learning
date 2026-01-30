import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabase';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useNavigate, useParams } from 'react-router-dom';

const PublishPage = () => {
  const { id } = useParams(); // Catch the ID if we're editing
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // 1. Feature State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // 2. Load Existing Data (If Editing)
  useEffect(() => {
    if (id) {
      const fetchBlogForEdit = async () => {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (data && !error) {
          setTitle(data.title);
          setContent(data.content);
          setPreviewUrl(data.image_url);
        }
      };
      fetchBlogForEdit();
    }
  }, [id]);

  // 3. Image Selection Feature
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Local preview
    }
  };

  // 4. The "Publish/Update" Feature
  const handlePublish = async () => {
    if (!user || !title || !content) return;
    setIsPublishing(true);

    try {
      let finalImageUrl = previewUrl; // Default to existing URL if no new file is uploaded

      // Upload image if a NEW file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const blogData = {
        title,
        content,
        image_url: finalImageUrl,
        user_id: user.id,
        author_email: user.email
      };

      // Decide: Update if ID exists, otherwise Insert
      const { error } = id 
        ? await supabase.from('blogs').update(blogData).eq('id', id)
        : await supabase.from('blogs').insert(blogData);

      if (error) throw error;

      navigate('/my-blogs');
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Reatined your original look */}
      <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300">
            {isPublishing ? 'Processing...' : id ? 'Editing Post' : 'Draft'}
          </span>
        </div>
        
        <button 
          onClick={handlePublish}
          disabled={isPublishing || !title}
          className="bg-black text-white px-8 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-gray-500 transition-all"
        >
          {isPublishing ? 'Please Wait' : id ? 'Update Post' : 'Publish Post'}
        </button>
      </div>

      {/* Writing Canvas - Retained exactly as you had it */}
      <main className="max-w-2xl mx-auto px-6 pt-12 pb-32">
        
        {/* Live Image Upload Area */}
        <div className="group relative w-full aspect-[21/9] bg-gray-50 mb-16 border border-gray-100 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400">Add Hero Image</p>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={onFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Title Input */}
        <input
          placeholder="Title"
          className="w-full text-5xl font-light tracking-tight placeholder:text-gray-400 border-b border-gray-200 focus:outline-none mb-12"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content Area */}
        <textarea
          placeholder="Tell your story..."
          className="w-full h-[300px] text-lg leading-relaxed font-light placeholder:text-gray-400 border border-gray-200 focus:outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </main>
    </div>
  );
};

export default PublishPage;