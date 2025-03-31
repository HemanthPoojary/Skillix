"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Bookmark, ChevronUp, ChevronDown, Play, Pause } from "lucide-react"

const feedItems = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      type: "video",
      title: "How to Solve Complex Math Problems Easily",
      description: "Learn these simple tricks to tackle difficult math problems in seconds!",
      media: "/placeholder.svg?height=600&width=400",
      duration: "2:45",
    },
    stats: {
      likes: 1243,
      comments: 89,
      shares: 56,
    },
    tags: ["math", "education", "tricks"],
  },
  {
    id: 2,
    user: {
      name: "Sophia Chen",
      username: "sophiac",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      type: "image",
      title: "5 Chemistry Experiments You Can Do at Home",
      description: "Safe and fun chemistry experiments using household items!",
      media: "/placeholder.svg?height=600&width=400",
    },
    stats: {
      likes: 876,
      comments: 124,
      shares: 45,
    },
    tags: ["chemistry", "experiments", "science"],
  },
  {
    id: 3,
    user: {
      name: "Marcus Williams",
      username: "marcusw",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      type: "quiz",
      title: "Test Your History Knowledge",
      description: "Think you know world history? Try this quick quiz!",
      media: "/placeholder.svg?height=600&width=400",
    },
    stats: {
      likes: 543,
      comments: 67,
      shares: 23,
    },
    tags: ["history", "quiz", "knowledge"],
  },
  {
    id: 4,
    user: {
      name: "Priya Patel",
      username: "priyap",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      type: "video",
      title: "Learn to Code in 10 Minutes a Day",
      description: "Start your coding journey with these simple daily exercises!",
      media: "/placeholder.svg?height=600&width=400",
      duration: "3:12",
    },
    stats: {
      likes: 2156,
      comments: 203,
      shares: 178,
    },
    tags: ["coding", "programming", "beginners"],
  },
]

export default function HomeFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

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
                      <AvatarImage src={item.user.avatar} />
                      <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item.user.name}</div>
                      <div className="text-xs text-muted-foreground">@{item.user.username}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Follow
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="relative aspect-video w-full bg-muted">
                  <img
                    src={item.content.media || "/placeholder.svg"}
                    alt={item.content.title}
                    className="h-full w-full object-cover"
                  />
                  {item.content.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 rounded-full opacity-90"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      {item.content.duration && (
                        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          {item.content.duration}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="mb-2 text-xl font-semibold">{item.content.title}</h3>
                  <p className="text-muted-foreground">{item.content.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-5 w-5" />
                    <span>{item.stats.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5" />
                    <span>{item.stats.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-5 w-5" />
                    <span>{item.stats.shares}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
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

