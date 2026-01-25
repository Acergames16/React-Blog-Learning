import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import Layout from '../components/Layout';
import supabase from '../api/supabase';

export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
}
const PostViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts } = useAppSelector((state) => state.blog);
  
  // Find the post in our Redux store
  const post = posts.find((p) => p.id === id);
  
  // Local state for fetching from Supabase if needed
  const [fetchedPost, setFetchedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    // If post is not in Redux, fetch from Supabase
    if (!post && id) {
      const fetchPost = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setFetchedPost(data);
        }
        setLoading(false);
      };

      fetchPost();
    }
  }, [id, post]);

  // Use fetched post if Redux post not available
  const displayPost = post || fetchedPost;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
        </div>
      </Layout>
    );
  }

  if (!displayPost) return (
    <Layout><div className="text-violet-600">Post not found...</div></Layout>
  );

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="mb-6 text-violet-600 hover:underline">
        ← Back to Feed
      </button>
      <article className="max-w-2xl bg-white p-10 rounded-3xl shadow-sm border border-violet-100">
        <span className="text-sm font-bold text-violet-500 uppercase">{displayPost.category}</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2 mb-6">{displayPost.title}</h1>
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 bg-violet-200 rounded-full flex items-center justify-center text-violet-700 font-bold">
            {displayPost.author_name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-800">{displayPost.author_name}</p>
            <p className="text-xs text-gray-400">{new Date(displayPost.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{displayPost.content}</p>
      </article>
    </Layout>
  );
};

export default PostViewPage;