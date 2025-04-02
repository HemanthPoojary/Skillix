import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a client even if env vars are missing, but it won't work
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper functions for common database operations

// User related operations
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_stats (*)
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getUserInterests = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_interests')
    .select(`
      interests (
        id,
        name
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map(item => item.interests);
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
};

// Post related operations
export const getFeedPosts = async (limit = 10, offset = 0) => {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: [],
        error: 'Supabase is not properly configured. Please check your environment variables.'
      };
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        type,
        title,
        description,
        media_url,
        duration,
        created_at,
        user_id,
        user:user_id (
          id,
          name,
          username,
          avatar_url
        ),
        post_stats!post_id (
          likes_count,
          comments_count,
          shares_count
        ),
        post_tags!post_id (
          tag:tag_id (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return { 
        data: [], 
        error: error.message || 'Failed to fetch posts from database' 
      };
    }

    if (!data) {
      return { data: [], error: null };
    }

    // Transform the data to match the expected format
    const transformedData = data.map(post => ({
      ...post,
      users: post.user,
      post_stats: post.post_stats?.[0] || { likes_count: 0, comments_count: 0, shares_count: 0 },
      post_tags: post.post_tags?.map(tag => ({
        tags: tag.tag
      })) || []
    }));

    return { data: transformedData, error: null };
  } catch (err) {
    console.error("Error in getFeedPosts:", err);
    return { 
      data: [], 
      error: err instanceof Error ? err.message : 'Failed to fetch posts' 
    };
  }
};

export const getPostById = async (postId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (id, name, username, avatar_url),
      post_stats (*),
      post_tags (
        tags (id, name)
      ),
      comments (
        id,
        content,
        created_at,
        users (id, name, username, avatar_url)
      )
    `)
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
};

export const createPost = async (userId: string, postData: any) => {
  try {
    // Step 1: Create the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert([{
        user_id: userId,
        type: postData.type || 'post',
        title: postData.title,
        description: postData.description,
        media_url: postData.media_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published'
      }])
      .select(`
        id,
        type,
        title,
        description,
        media_url,
        created_at,
        updated_at,
        status,
        user_id
      `)
      .single();

    if (postError) {
      console.error("Error creating post:", postError);
      throw new Error(postError.message);
    }

    if (!post) {
      throw new Error('Failed to create post');
    }

    // Step 2: Create post stats
    await supabase
      .from('post_stats')
      .insert([{
        post_id: post.id,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0
      }]);

    // Step 3: Create post tags if any
    if (postData.tags && postData.tags.length > 0) {
      const tagInserts = postData.tags.map((tag: string) => ({
        post_id: post.id,
        tag_id: tag
      }));

      await supabase
        .from('post_tags')
        .insert(tagInserts);
    }

    return post;
  } catch (err) {
    console.error("Error in createPost:", err);
    throw err;
  }
};

// Like operations
export const likePost = async (userId: string, postId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .insert({
      user_id: userId,
      post_id: postId
    });

  if (error) throw error;
  
  // Update the post_stats likes count
  await supabase.rpc('increment_post_likes', { post_id: postId });
  
  return data;
};

export const unlikePost = async (userId: string, postId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .delete()
    .match({
      user_id: userId,
      post_id: postId
    });

  if (error) throw error;
  
  // Update the post_stats likes count
  await supabase.rpc('decrement_post_likes', { post_id: postId });
  
  return data;
};

// Comment operations
export const addComment = async (userId: string, postId: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      post_id: postId,
      content
    })
    .select();

  if (error) throw error;
  
  // Update the post_stats comments count
  await supabase.rpc('increment_post_comments', { post_id: postId });
  
  return data;
};

// User connections (follow/unfollow)
export const followUser = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('user_connections')
    .insert({
      follower_id: followerId,
      following_id: followingId
    });

  if (error) throw error;
  return data;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('user_connections')
    .delete()
    .match({
      follower_id: followerId,
      following_id: followingId
    });

  if (error) throw error;
  return data;
};

// Events
export const getUpcomingEvents = async (limit = 10) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Trending topics
export const getTrendingTopics = async (limit = 5) => {
  const { data, error } = await supabase
    .from('trending_topics')
    .select('*')
    .eq('is_trending', true)
    .order('post_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}; 