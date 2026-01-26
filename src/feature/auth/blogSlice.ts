import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
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
  // --- NEW PAGINATION STATE ---
  totalCount: number;
  currentPage: number;
}

const initialState: BlogState = {
  posts: [],
  status: 'idle',
  error: null,
  totalCount: 0,
  currentPage: 1,
};

// FETCH with Pagination
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts', 
  async (page: number) => {
    const itemsPerPage = 10;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { posts: data as Post[], totalCount: count || 0 };
  }
);

// CREATE
export const addNewPost = createAsyncThunk('blog/addNewPost', async (newPost: Partial<Post>) => {
  const { data, error } = await supabase.from('posts').insert([newPost]).select();
  if (error) throw error;
  return data[0] as Post;
});

// UPDATE
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

// DELETE
export const removePost = createAsyncThunk('blog/removePost', async (postId: string) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
  return postId;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // --- ACTION TO CHANGE PAGE ---
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 1. Fetching
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.posts;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      
      // 2. Creating
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.totalCount += 1; // Increment total count for pagination
      })
      
      // 3. Updating
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      
      // 4. Deleting
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
        state.totalCount -= 1; // Decrement total count for pagination
      });
  }
});

export const { setPage } = blogSlice.actions;
export default blogSlice.reducer;