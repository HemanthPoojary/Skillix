import { Button } from "@/components/ui/button"
import HomeFeed from "@/components/home-feed"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Feed</h1>
          <p className="text-muted-foreground">Educational content tailored for you</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Following
          </Button>
          <Button size="sm">For You</Button>
        </div>
      </div>

      {/* Main Feed - Full Width */}
      <div className="w-full max-w-3xl mx-auto">
        <HomeFeed />
      </div>
    </div>
  )
}

