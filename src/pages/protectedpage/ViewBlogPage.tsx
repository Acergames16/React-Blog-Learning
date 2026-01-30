import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../api/supabase'; // Using your specific path
import { useSelector } from 'react-redux';
import type{ RootState } from '../../app/store';
import CommentsSection from '../../components/layout/CommentSection';

const ViewBlogPage = () => {
  const { id } = useParams();
  // Safety check: accessing auth safely
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user; 
  
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPostAndLikes = async () => {
      try {
        // 1. Fetch the Blog
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .maybeSingle(); // Better than .single() for handling "not found"

        if (blogError) throw blogError;
        if (!blogData) {
          setLoading(false);
          return;
        }

        setBlog(blogData);
        
        // 2. Fetch Like Count (Optimized)
        const { count, error: countError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('blog_id', id);
        
        if (!countError) setLikeCount(count || 0);

        // 3. Check if current user liked it
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('*')
            .eq('blog_id', id)
            .eq('user_id', user.id)
            .maybeSingle(); // Doesn't crash if no row exists
          
          setIsLiked(!!likeData);
        }
      } catch (err) {
        console.error("ViewPage Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostAndLikes();
  }, [id, user]);

  const toggleLike = async () => {
    if (!user) return alert("Please sign in to like posts.");

    // Optimistic UI update: change the UI before the DB response
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    if (previousLiked) {
      // Unlike: Delete the record
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('blog_id', id)
        .eq('user_id', user.id);
      
      if (error) { // Rollback on failure
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
      }
    } else {
      // Like: Insert a new record
      const { error } = await supabase
        .from('likes')
        .insert({ blog_id: id, user_id: user.id });

      if (error) { // Rollback on failure
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">
      Loading Story...
    </div>
  );

  if (!blog) return <div className="p-20 text-center text-[10px] uppercase tracking-widest text-gray-400">Story not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. Hero Image Section */}
      <div className="w-full h-[60vh] bg-gray-50 overflow-hidden">
        {blog.image_url && (
          <img 
            src={blog.image_url} 
            alt={blog.title} 
            className="w-full h-full object-cover grayscale-[20%]"
          />
        )}
      </div>

      {/* 2. Content Container */}
      <main className="max-w-2xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-50">
          
          {/* Metadata */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black font-medium">
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="h-[1px] w-8 bg-gray-200"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              By {blog.author_email?.split('@')[0] || 'Anonymous'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-light tracking-tight leading-tight mb-12 italic">
            {blog.title}
          </h1>

          {/* Body Text */}
          <div className="prose prose-zinc max-w-none mb-20">
            <p className="text-lg leading-relaxed font-light text-zinc-800 whitespace-pre-line">
              {blog.content}
            </p>
          </div>

          {/* 3. Social Interaction Area */}
          <div className="pt-1 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button 
                onClick={toggleLike}
                className="flex items-center gap-2 group"
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  isLiked ? 'bg-black border-black text-white' : 'border-gray-100 group-hover:border-black'
                }`}>
                  <span className="text-[10px]">{isLiked ? '✓' : 'L'}</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                </span>
              </button>

              <button className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                Responses
              </button>
            </div>

            <button className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black underline underline-offset-8">
              Share
            </button>
          </div>
          <CommentsSection blogId={id!} />
        </div>
      </main>
    </div>
  );
};

export default ViewBlogPage;