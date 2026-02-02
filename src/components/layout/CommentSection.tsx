import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../../api/supabase';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const CommentsSection = ({ blogId }: { blogId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // States for Editing existing comments
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

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

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId, fetchComments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = window.confirm("Remove this response?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err: any) {
      console.error("Delete Error:", err.message);
      alert("Could not delete comment.");
    }
  };

  // --- Start Edit Logic ---
  const startEditing = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent })
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, content: editContent } : c
      ));
      setEditingId(null);
    } catch (err: any) {
      console.error("Update Error:", err.message);
      alert("Failed to update response.");
    }
  };
  // --- End Edit Logic ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setUploading(true);

    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
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

      setNewComment('');
      handleRemoveImage();
      fetchComments(); 
    } catch (err: any) {
      console.error("Comment Error:", err.message);
      alert("Failed to post comment.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 border-t border-gray-100 pt-2 pb-20">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-10">
        Responses ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-20 border border-gray-200 p-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the story..."
            className="w-full border-b border-gray-100 focus:border-black outline-none py-4 resize-none font-light text-sm transition-all duration-300 min-h-[80px]"
          />
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer group flex items-center gap-2">
                <div className="w-5 h-5 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                  <span className="text-xs font-light">{imageFile ? '✓' : '+'}</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 group-hover:text-black">
                  {imageFile ? 'Change Image' : 'Attach Image'}
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {imageFile && (
                <button type="button" onClick={handleRemoveImage} className="text-[9px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
                  <span>✕</span> Remove
                </button>
              )}
            </div>
            <button type="submit" disabled={uploading || !newComment.trim()} className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-8 py-3 hover:bg-zinc-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all">
              {uploading ? 'Sending...' : 'Publish Response'}
            </button>
          </div>
          {previewUrl && (
            <div className="mt-6 w-20 h-20 border border-gray-100 overflow-hidden relative group">
              <img src={previewUrl} className="w-full h-full object-cover grayscale" alt="preview" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity" onClick={handleRemoveImage}>
                <span className="text-white text-[8px]">✕</span>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="mb-20 p-8 bg-gray-50 text-center text-[10px] uppercase tracking-widest text-gray-400">
          Please sign in to join the conversation
        </div>
      )}

      <div className="space-y-16">
        {comments.map((comment) => (
          <div key={comment.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
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

              {user && user.id === comment.user_id && (
                <div className="flex gap-4">
                  {editingId !== comment.id && (
                    <button onClick={() => startEditing(comment)} className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-black transition-colors">
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <div className="pl-10">
              {editingId === comment.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border border-gray-200 p-4 text-sm font-light focus:outline-none focus:border-black min-h-[100px] resize-none"
                  />
                  <div className="flex gap-4">
                    <button onClick={() => handleUpdateComment(comment.id)} className="text-[9px] uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-zinc-800">
                      Save Changes
                    </button>
                    <button onClick={cancelEditing} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-600 font-light leading-relaxed mb-6 whitespace-pre-line">
                  {comment.content}
                </p>
              )}
              
              {comment.image_url && (
                <div className="max-w-sm overflow-hidden border border-gray-50">
                   <img src={comment.image_url} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" alt="attachment" />
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