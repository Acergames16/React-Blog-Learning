import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchPosts, setPage } from '../feature/auth/blogSlice';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const FeaturedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // 1. Pull everything from the Redux Blog Slice
  const { posts, status, totalCount, currentPage } = useAppSelector((state) => state.blog);

  // Calculate total pages (10 posts per page)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 2. Fetch data whenever the page changes
  useEffect(() => {
    dispatch(fetchPosts(currentPage));
  }, [currentPage, dispatch]);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Featured Blogs</h1>
        <p className="text-sm text-gray-500 font-medium">
          Showing {posts.length} of {totalCount} stories
        </p>
      </div>
      
      {status === 'loading' ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-violet-100/50 rounded-3xl border border-violet-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <div key={post.id} className="p-8 bg-white rounded-[32px] shadow-sm border border-violet-100 hover:shadow-md transition-all group">
                <span className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                
                <h2 className="text-2xl font-bold text-gray-800 mt-4 group-hover:text-violet-700 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-xs font-bold">
                      {post.author_name ? post.author_name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-gray-700">{post.author_name}</p>
                      <p className="text-gray-400 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Link 
                    to={`/view/${post.id}`} 
                    className="px-5 py-2 bg-violet-50 text-violet-600 font-bold rounded-xl hover:bg-violet-600 hover:text-white transition-all text-sm"
                  >
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={() => dispatch(setPage(currentPage - 1))}
                className="p-2 w-10 h-10 flex items-center justify-center rounded-xl border border-violet-200 text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-50 transition-all font-bold"
              >
                ←
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => dispatch(setPage(pageNum))}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === pageNum 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                        : 'bg-white border border-violet-100 text-gray-400 hover:border-violet-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => dispatch(setPage(currentPage + 1))}
                className="p-2 w-10 h-10 flex items-center justify-center rounded-xl border border-violet-200 text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-50 transition-all font-bold"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default FeaturedPage;