"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users, BookOpen, Briefcase, Building2, GraduationCap } from "lucide-react"

type SearchResult = {
  id: number
  type: "user" | "course" | "company"
  name?: string
  username?: string
  avatar?: string
  bio?: string
  skills?: string[]
  title?: string
  instructor?: string
  rating?: number
  students?: number
  price?: string
  thumbnail?: string
  logo?: string
  description?: string
  location?: string
  size?: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const results: SearchResult[] = [
    {
      id: 1,
      type: "user",
      name: "Sophia Chen",
      username: "@sophia",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Full-stack developer | Open source contributor",
      skills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: 2,
      type: "course",
      title: "Advanced React Patterns",
      instructor: "Marcus Williams",
      rating: 4.8,
      students: 1234,
      price: "$49.99",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      type: "company",
      name: "TechCorp Inc.",
      logo: "/placeholder.svg?height=40&width=40",
      description: "Leading technology solutions provider",
      location: "San Francisco, CA",
      size: "100-500 employees",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          {query ? `Showing results for "${query}"` : "Enter a search term to begin"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden">
            {result.type === "user" && result.name && result.skills && (
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={result.avatar} />
                    <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.username}</div>
                    <p className="mt-2 text-sm">{result.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {result.type === "course" && result.title && (
              <>
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="font-medium">{result.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Instructor: {result.instructor}
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{result.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{result.students} students</span>
                    </div>
                  </div>
                  <div className="mt-4 font-medium text-primary">{result.price}</div>
                </CardContent>
              </>
            )}

            {result.type === "company" && result.name && (
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-lg">
                    <img
                      src={result.logo}
                      alt={result.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{result.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{result.location}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{result.size}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
} 