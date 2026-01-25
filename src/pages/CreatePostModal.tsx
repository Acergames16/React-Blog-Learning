import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNewPost, updatePost } from '../feature/auth/blogSlice';

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingPost?: Post | null;
}

const CreatePostModal: React.FC<Props> = ({ isOpen, onClose, editingPost }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');

  // Sync internal state with the post being edited
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setCategory(editingPost.category || 'General');
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
    }
  }, [editingPost, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPost) {
      // Logic for UPDATING
      dispatch(updatePost({ 
        id: editingPost.id, 
        title, 
        content,
        category 
      }));
    } else {
      // Logic for CREATING
      dispatch(addNewPost({ 
        title, 
        content, 
        category,
        user_id: user?.id,
        author_name: user?.user_metadata.username || user?.email 
      }));
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg overflow-hidden rounded-[32px] shadow-2xl border border-violet-100 animate-in fade-in zoom-in duration-200">
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {editingPost ? 'Adjust your story and keep it fresh.' : 'Share your latest thoughts with the community.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Title</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-gray-800"
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-gray-800 bg-white"
              >
                <option value="General">General</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Content</label>
              <textarea 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-gray-800 resize-none"
                placeholder="Write your heart out..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
              >
                {editingPost ? 'Update Story' : 'Publish Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;