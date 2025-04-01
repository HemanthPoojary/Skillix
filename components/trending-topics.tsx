"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { getTrendingTopics } from "@/lib/supabase"

interface TrendingTopic {
  id: string
  name: string
  post_count: number
  is_trending: boolean
  trend_started_at: string
}

export default function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setIsLoading(true)
        const topicsData = await getTrendingTopics(5) // Fetch top 5 trending topics
        setTopics(topicsData || [])
      } catch (err) {
        console.error("Error fetching trending topics:", err)
        setError("Failed to load trending topics")
      } finally {
        setIsLoading(false)
      }
    }

    loadTopics()
  }, [])

  const formatPostCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k posts`
    }
    return `${count} posts`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            Loading topics...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No trending topics
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-1 bg-primary/10">
                    #{topic.name}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{formatPostCount(topic.post_count)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

