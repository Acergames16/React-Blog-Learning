import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchPosts, removePost } from '../feature/auth/blogSlice';
import Layout from '../components/Layout';
import CreatePostModal from '../pages/CreatePostModal';

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
}

const MyBlogsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // 1. Get data from Redux Store
  const { posts, status } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.auth);

  // 2. Local state for Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 3. Filter global posts to only show current user's blogs
  const myPosts = posts.filter((p) => p.user_id === user?.id);

  useEffect(() => {
    // Only fetch if we haven't already or if state is idle
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      dispatch(removePost(id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
          <p className="text-violet-600 font-medium">
            {myPosts.length} {myPosts.length === 1 ? 'post' : 'posts'} published
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> New Post
        </button>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <div 
                key={post.id} 
                className="group p-6 bg-white rounded-3xl border border-violet-50 flex justify-between items-center hover:border-violet-200 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">
                      {post.category}
                    </span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-xl group-hover:text-violet-900 transition-colors">
                    {post.title}
                  </h3>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl text-sm font-bold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[40px] p-20 border-2 border-dashed border-violet-100 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center text-4xl mb-6">
                 ✍️
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">No stories yet</h3>
               <p className="text-gray-400 max-w-sm">
                 Your personal dashboard is empty. Click "New Post" to start sharing your thoughts.
               </p>
            </div>
          )}
        </div>
      )}

      {/* The Modal handles both Add and Edit logic */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        editingPost={selectedPost} 
      />
    </Layout>
  );
};

export default MyBlogsPage;