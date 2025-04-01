import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (id, name, username, avatar_url),
      post_stats (*),
      post_tags (
        tags (id, name)
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      ...postData
    })
    .select();

  if (error) throw error;
  return data;
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