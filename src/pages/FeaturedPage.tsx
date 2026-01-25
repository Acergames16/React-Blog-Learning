import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import supabase from '../api/supabase';
import { Link } from 'react-router-dom';

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
}

const FeaturedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Featured Blogs</h1>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-violet-100 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="p-6 bg-white rounded-2xl shadow-sm border border-violet-100">
              <span className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-bold rounded-full uppercase">
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-3">{post.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400">
                <span>By {post.author_name}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <Link 
                to={`/view/${post.id}`} 
                className="text-violet-600 font-bold hover:text-violet-800 transition-colors"
                >
                View Full Story →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default FeaturedPage;