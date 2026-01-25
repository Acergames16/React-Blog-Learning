import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../api/supabase';



export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
}

interface BlogState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  status: 'idle',
  error: null,
};

/** * CRUD ACTIONS (Async Thunks)
 * These handle the interaction with the database
 */

// READ
export const fetchPosts = createAsyncThunk('blog/fetchPosts', async () => {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Post[];
});

// CREATE
export const addNewPost = createAsyncThunk('blog/addNewPost', async (newPost: Partial<Post>) => {
  const { data, error } = await supabase.from('posts').insert([newPost]).select();
  if (error) throw error;
  return data[0] as Post;
});

// DELETE
export const removePost = createAsyncThunk('blog/removePost', async (postId: string) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
  return postId;
});

export const updatePost = createAsyncThunk(
  'blog/updatePost', 
  async ({ id, title, content, category }: { id: string, title: string, content: string, category: string }) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ title, content, category })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Post;
  }
);
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  builder
    // 1. Fetching
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.status = 'succeeded';
    })
    // 2. Creating
    .addCase(addNewPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
    })
    // 3. Updating (The Edit)
    .addCase(updatePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    })
    // 4. Deleting
    .addCase(removePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    });
  }
});

export default blogSlice.reducer;