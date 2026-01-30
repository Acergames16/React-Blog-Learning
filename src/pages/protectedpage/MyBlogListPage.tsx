import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabase';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom'; // Added for navigation

const MyBlogListPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate(); // Hook for the Edit button

  useEffect(() => {
    const fetchMyBlogs = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setBlogs(data);
      setLoading(false);
    };

    fetchMyBlogs();
  }, [user]);

  // --- Logic Features ---

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this story? This action cannot be undone.");
    
    if (confirmDelete) {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (!error) {
        // Optimistic UI: Filter out the deleted blog from state so it disappears instantly
        setBlogs(prev => prev.filter(blog => blog.id !== id));
      } else {
        alert("Error deleting post: " + error.message);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`); // Redirects to the PublishPage in Edit mode
  };

  // --- End Logic Features ---

  if (loading) return <div className="p-20 text-[10px] uppercase tracking-widest text-gray-400">Loading your stories...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-[10px] uppercase tracking-[0.4em] text-black mb-12">Dashboard / My Stories</h1>
      
      <div className="space-y-12 ">
        {blogs.length === 0 ? (
          <p className="text-sm font-light text-gray-400 italic">No stories published yet.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="flex gap-8 items-center border-b border-gray-300 pb-1 mb-1 group">
              {/* Thumbnail */}
              <div className="w-32 h-32 bg-gray-50 shrink-0 overflow-hidden">
                {blog.image_url && (
                  <img src={blog.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-light tracking-tight mb-2">{blog.title}</h2>
                <div className="flex gap-4 text-[9px] uppercase tracking-widest text-gray-400">
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  
                  {/* Updated Buttons */}
                  <button 
                    onClick={() => handleEdit(blog.id)}
                    className="hover:text-black transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogListPage;