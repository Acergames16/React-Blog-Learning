import React, { useState, useEffect, useCallback } from 'react';
import  supabase  from '../../api/supabase';
import { useSelector } from 'react-redux';
import type{ RootState } from '../../app/store';

const CommentsSection = ({ blogId }: { blogId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 1. Define fetch function FIRST so it's available to everything below
  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setComments(data);
    }
  }, [blogId]);

  // 2. useEffect calls the function defined above
  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId, fetchComments]);

  // 3. handleSubmit also calls the function defined above
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setUploading(true);

    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('comment-images')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('comment-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('comments').insert({
        blog_id: blogId,
        user_id: user.id,
        author_email: user.email,
        content: newComment,
        image_url: imageUrl
      });

      if (insertError) throw insertError;

      // SUCCESS: Reset state and REFRESH list
      setNewComment('');
      setImageFile(null);
      fetchComments(); 
      
    } catch (err: any) {
      console.error("Comment Error:", err.message);
      alert("Failed to post comment. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 border-t border-gray-100 pt-2 pb-20">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-10">
        Responses ({comments.length})
      </h3>

      {/* Form Area */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-20 border border-gray-200 ">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the story..."
            className="w-full border-b border-gray-100 focus:border-black outline-none py-4 resize-none font-light text-sm transition-all duration-300 min-h-[80px]"
          />
          
          <div className="flex justify-between items-center mt-4">
            {/* Minimalist File Input */}
            <label className="cursor-pointer group flex items-center gap-2">
              <div className="w-5 h-5 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                <span className="text-xs font-light">{imageFile ? '✓' : '+'}</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 group-hover:text-black">
                {imageFile ? imageFile.name.slice(0, 15) : 'Attach Image'}
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden" 
              />
            </label>

            <button 
              type="submit"
              disabled={uploading || !newComment.trim()}
              className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-8 py-3 hover:bg-zinc-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
            >
              {uploading ? 'Sending...' : 'Publish Response'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-20 p-8 bg-gray-50 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            Please sign in to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-16">
        {comments.map((comment) => (
          <div key={comment.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white uppercase">{comment.author_email?.[0]}</span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {comment.author_email?.split('@')[0]}
              </span>
              <span className="text-[9px] text-gray-300 tracking-widest">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="pl-10">
              <p className="text-sm text-zinc-600 font-light leading-relaxed mb-6 whitespace-pre-line">
                {comment.content}
              </p>
              
              {comment.image_url && (
                <div className="max-w-sm overflow-hidden border border-gray-50">
                   <img 
                    src={comment.image_url} 
                    className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" 
                    alt="attachment" 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;