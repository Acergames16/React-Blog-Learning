import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabase';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useNavigate, Link } from 'react-router-dom';

const MyBlogListPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevents the Link from navigating
    e.stopPropagation(); // Stops the event from bubbling up to the card
    
    const confirmDelete = window.confirm("Are you sure you want to delete this story? This action cannot be undone.");
    
    if (confirmDelete) {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (!error) {
        setBlogs(prev => prev.filter(blog => blog.id !== id));
      } else {
        alert("Error deleting post: " + error.message);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevents the Link from navigating
    e.stopPropagation(); // Stops the event from bubbling up to the card
    navigate(`/edit/${id}`);
  };

  if (loading) return <div className="p-20 text-[10px] uppercase tracking-widest text-gray-400">Loading your stories...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-[10px] uppercase tracking-[0.4em] text-black mb-12">Dashboard / My Stories</h1>
      
      <div className="space-y-12">
        {blogs.length === 0 ? (
          <p className="text-sm font-light text-gray-400 italic">No stories published yet.</p>
        ) : (
          blogs.map((blog) => (
            /* Card Wrapper as Link */
            <Link 
              to={`/view/${blog.id}`} 
              key={blog.id} 
              className="flex gap-8 items-center border-b border-gray-300 pb-8 mb-1 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-32 h-32 bg-gray-50 shrink-0 overflow-hidden">
                {blog.image_url && (
                  <img 
                    src={blog.image_url} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    alt="" 
                  />
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-light tracking-tight mb-4 group-hover:text-zinc-500 transition-colors">
                  {blog.title}
                </h2>
                <div className="flex gap-6 text-[9px] uppercase tracking-widest text-gray-400">
                  <span className="text-black font-medium">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => handleEdit(e, blog.id)}
                      className="hover:text-black transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, blog.id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogListPage;