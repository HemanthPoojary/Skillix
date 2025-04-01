-- Create functions for updating post stats
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE post_stats
  SET likes_count = likes_count + 1,
      updated_at = NOW()
  WHERE post_id = $1;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE post_stats
  SET likes_count = GREATEST(0, likes_count - 1),
      updated_at = NOW()
  WHERE post_id = $1;
END;
$$;

CREATE OR REPLACE FUNCTION increment_post_comments(post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE post_stats
  SET comments_count = comments_count + 1,
      updated_at = NOW()
  WHERE post_id = $1;
END;
$$;

CREATE OR REPLACE FUNCTION increment_post_shares(post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE post_stats
  SET shares_count = shares_count + 1,
      updated_at = NOW()
  WHERE post_id = $1;
END;
$$;

CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE post_stats
  SET views_count = views_count + 1,
      updated_at = NOW()
  WHERE post_id = $1;
END;
$$; 