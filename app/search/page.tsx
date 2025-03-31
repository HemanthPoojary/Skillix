"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Hash } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  // Mock search results - in a real app, these would come from an API
  const results = {
    posts: [
      {
        id: 1,
        title: "How to Solve Quadratic Equations",
        author: "Alex Johnson",
        views: 1200,
        date: "2 days ago",
        tags: ["Math", "Algebra"],
      },
      {
        id: 2,
        title: "Chemistry Lab Results",
        author: "Sophia Chen",
        views: 850,
        date: "1 week ago",
        tags: ["Science", "Chemistry"],
      },
      {
        id: 3,
        title: "My Coding Journey",
        author: "Marcus Williams",
        views: 2100,
        date: "3 days ago",
        tags: ["Programming", "Web Development"],
      },
    ],
    people: [
      {
        id: 1,
        name: "Alex Johnson",
        username: "@alexj",
        bio: "Math enthusiast and science lover",
        followers: 1200,
        tags: ["Math", "Science"],
      },
      {
        id: 2,
        name: "Sophia Chen",
        username: "@sophiac",
        bio: "Chemistry student and researcher",
        followers: 850,
        tags: ["Science", "Chemistry"],
      },
      {
        id: 3,
        name: "Marcus Williams",
        username: "@marcusw",
        bio: "Full-stack developer and tech enthusiast",
        followers: 2100,
        tags: ["Programming", "Web Development"],
      },
    ],
    tags: [
      {
        id: 1,
        name: "Mathematics",
        posts: 1500,
        followers: 5000,
      },
      {
        id: 2,
        name: "Science",
        posts: 1200,
        followers: 4500,
      },
      {
        id: 3,
        name: "Programming",
        posts: 2000,
        followers: 8000,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          Showing results for "{query}"
        </p>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">{post.title}</h3>
                  <div className="mb-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{post.author}</span>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.views} views</span>
                    <span>{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="people" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.people.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                      <AvatarFallback>{person.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.username}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{person.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {person.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{person.followers} followers</span>
                    <Button size="sm">Follow</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.tags.map((tag) => (
              <Card key={tag.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">#{tag.name}</h3>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{tag.posts} posts</span>
                    <span>{tag.followers} followers</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 