"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Bookmark, ChevronUp, ChevronDown, Play, Pause, Loader2 } from "lucide-react"
import { getFeedPosts, likePost, unlikePost, followUser, unfollowUser } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Define the post type
interface Post {
  id: string
  type: string
  title: string
  description: string
  media_url: string
  duration?: string
  created_at: string
  users: {
    id: string
    name: string
    username: string
    avatar_url: string
  }
  post_stats: {
    likes_count: number
    comments_count: number
    shares_count: number
  }
  post_tags: {
    tags: {
      id: string
      name: string
    }
  }[]
}

export default function HomeFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedItems, setFeedItems] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({})
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({})
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const feedRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Fetch posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        const posts = await getFeedPosts(10, 0)
        setFeedItems(posts || [])
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("Failed to load posts. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleNext = () => {
    if (currentIndex < feedItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to like posts",
        variant: "destructive"
      })
      return
    }
    
    try {
      setActionLoading({...actionLoading, [`like-${postId}`]: true})
      
      if (likedPosts[postId]) {
        await unlikePost(user.id, postId)
        // Update the UI optimistically
        setLikedPosts({...likedPosts, [postId]: false})
        setFeedItems(feedItems.map(item => 
          item.id === postId 
            ? {...item, post_stats: {...item.post_stats, likes_count: item.post_stats.likes_count - 1}} 
            : item
        ))
      } else {
        await likePost(user.id, postId)
        // Update the UI optimistically
        setLikedPosts({...likedPosts, [postId]: true})
        setFeedItems(feedItems.map(item => 
          item.id === postId 
            ? {...item, post_stats: {...item.post_stats, likes_count: item.post_stats.likes_count + 1}} 
            : item
        ))
      }
    } catch (err) {
      console.error("Error liking/unliking post:", err)
      toast({
        title: "Action failed",
        description: "Could not like the post. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setActionLoading({...actionLoading, [`like-${postId}`]: false})
    }
  }

  const handleFollow = async (userId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to follow users",
        variant: "destructive"
      })
      return
    }
    
    try {
      setActionLoading({...actionLoading, [`follow-${userId}`]: true})
      
      if (followedUsers[userId]) {
        await unfollowUser(user.id, userId)
        setFollowedUsers({...followedUsers, [userId]: false})
      } else {
        await followUser(user.id, userId)
        setFollowedUsers({...followedUsers, [userId]: true})
        toast({
          title: "Success",
          description: "You are now following this user",
        })
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err)
      toast({
        title: "Action failed",
        description: "Could not follow the user. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setActionLoading({...actionLoading, [`follow-${userId}`]: false})
    }
  }

  const handleSave = async (postId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to save posts",
        variant: "destructive"
      })
      return
    }
    
    // Toggle saved state for UI
    setSavedPosts({...savedPosts, [postId]: !savedPosts[postId]})
    
    toast({
      title: savedPosts[postId] ? "Post removed" : "Post saved",
      description: savedPosts[postId] 
        ? "Post removed from your saved items" 
        : "Post saved to your profile",
    })
    
    // Here you would typically call an API to save the post to the user's profile
    // For now it's just UI state
  }

  const handleComment = (postId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to comment on posts",
        variant: "destructive"
      })
      return
    }
    
    // Navigate to the post page with comments section
    router.push(`/post/${postId}`)
  }

  useEffect(() => {
    if (feedRef.current) {
      const cards = feedRef.current.querySelectorAll(".feed-card")
      if (cards[currentIndex]) {
        cards[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentIndex])

  if (isLoading) {
    return <div className="flex h-[calc(100vh-12rem)] items-center justify-center">Loading posts...</div>
  }

  if (error) {
    return <div className="flex h-[calc(100vh-12rem)] items-center justify-center text-red-500">{error}</div>
  }

  if (feedItems.length === 0) {
    return <div className="flex h-[calc(100vh-12rem)] items-center justify-center">No posts found</div>
  }

  return (
    <div className="relative">
      <div ref={feedRef} className="feed-scroll relative h-[calc(100vh-12rem)] overflow-y-auto snap-y snap-mandatory">
        {feedItems.map((item, index) => (
          <div key={item.id} className="feed-card mb-4 snap-start snap-always">
            <Card className="overflow-hidden transition-all duration-300">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={item.users.avatar_url || "/placeholder.svg?height=40&width=40"} />
                      <AvatarFallback>{item.users.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item.users.name}</div>
                      <div className="text-xs text-muted-foreground">{item.users.username}</div>
                    </div>
                  </div>
                  <Button 
                    variant={followedUsers[item.users.id] ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleFollow(item.users.id)}
                    disabled={actionLoading[`follow-${item.users.id}`]}
                  >
                    {actionLoading[`follow-${item.users.id}`] ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : null}
                    {followedUsers[item.users.id] ? "Following" : "Follow"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="relative aspect-video w-full bg-muted">
                  <img
                    src={item.media_url || "/placeholder.svg?height=600&width=400"}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 rounded-full opacity-90"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      {item.duration && (
                        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          {item.duration}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.post_tags?.map((tagItem) => (
                      <Badge key={tagItem.tags.id} variant="secondary">
                        #{tagItem.tags.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center gap-1 ${likedPosts[item.id] ? 'text-red-500' : ''}`}
                    onClick={() => handleLike(item.id)}
                    disabled={actionLoading[`like-${item.id}`]}
                  >
                    <Heart className={`h-5 w-5 ${likedPosts[item.id] ? 'fill-current text-red-500' : ''}`} />
                    <span>{item.post_stats.likes_count}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleComment(item.id)}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{item.post_stats.comments_count}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-5 w-5" />
                    <span>{item.post_stats.shares_count}</span>
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleSave(item.id)}
                >
                  <Bookmark className={`h-5 w-5 ${savedPosts[item.id] ? 'fill-current' : ''}`} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full opacity-80 shadow-lg"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full opacity-80 shadow-lg"
          onClick={handleNext}
          disabled={currentIndex === feedItems.length - 1}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

