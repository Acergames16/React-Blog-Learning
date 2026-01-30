import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabase';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 6;

const FeedPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFeed = async (page: number) => {
    setLoading(true);
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      setBlogs(data);
      if (count !== null) setTotalCount(count);
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchFeed(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-gray-300 animate-pulse">
          Indexing Archive...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-[10px] uppercase tracking-[0.4em] text-black mb-4">The Collective</h1>
        <h2 className="text-4xl font-light tracking-tight text-zinc-900">Recent Stories</h2>
      </div>

      {/* TOP PAGINATION BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between border-y border-gray-200 py-6 mb-16 gap-6">
        <div className="text-[9px] uppercase tracking-[0.3em] text-gray-600">
          Showing Page {currentPage} of {totalPages || 1}
        </div>

        <div className="flex items-center gap-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="text-[9px] uppercase tracking-widest disabled:text-gray-400 hover:text-black transition-colors"
          >
            ← Prev
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-[10px] w-5 h-5 flex items-center justify-center transition-all ${
                  currentPage === i + 1 
                  ? 'bg-black text-white' 
                  : 'text-gray-300 hover:text-black'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="text-[9px] uppercase tracking-widest disabled:text-gray-400 hover:text-black transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Live Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
        {blogs.map((blog) => (
          <Link to={`/view/${blog.id}`} key={blog.id} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 border border-gray-100">
              {blog.image_url ? (
                <img 
                  src={blog.image_url} 
                  alt={blog.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-widest text-gray-300">No Image</div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-black font-semibold">
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="h-[1px] w-4 bg-gray-200"></div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400">
                  {blog.author_email?.split('@')[0]}
                </span>
              </div>
              <h3 className="text-2xl font-light tracking-tight group-hover:text-zinc-500 transition-colors leading-tight">{blog.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-2">{blog.content}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Optional Footer spacing */}
      <div className="mt-32 border-t border-gray-50"></div>
    </div>
  );
};

export default FeedPage;