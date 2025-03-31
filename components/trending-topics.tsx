import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const trendingTopics = [
  { id: 1, name: "Quantum Physics", count: "12.5k posts" },
  { id: 2, name: "AI Ethics", count: "8.3k posts" },
  { id: 3, name: "Climate Science", count: "7.1k posts" },
  { id: 4, name: "Coding Challenges", count: "6.9k posts" },
  { id: 5, name: "Space Exploration", count: "5.4k posts" },
]

export default function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-1 bg-primary/10">
                  #{topic.name}
                </Badge>
                <div className="text-xs text-muted-foreground">{topic.count}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

