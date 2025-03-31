import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star, Calendar, TrendingUp } from "lucide-react"

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See who's leading the way in learning and sharing</p>
      </div>

      {/* Top 3 Users */}
      <div className="mb-8">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-5 w-5 text-primary" />
          Top Performers
        </h2>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          {/* 2nd Place */}
          <div className="order-1 flex flex-col items-center md:order-1">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#C0C0C0] text-white">
              <Medal className="h-8 w-8" />
            </div>
            <div className="relative">
              <Avatar className="h-24" />
            </div>
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback>2</AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#C0C0C0] text-white">
                <span className="text-lg font-bold">2</span>
              </div>
            </div>
            <h3 className="mt-2 text-lg font-semibold">Sophia Chen</h3>
            <p className="text-sm text-muted-foreground">9,750 points</p>
          </div>

          {/* 1st Place */}
          <div className="order-0 flex flex-col items-center md:order-0">
            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFD700] text-white">
              <Trophy className="h-10 w-10" />
            </div>
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src="/placeholder.svg?height=128&width=128" />
                <AvatarFallback>1</AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700] text-white">
                <span className="text-xl font-bold">1</span>
              </div>
            </div>
            <h3 className="mt-2 text-xl font-semibold">Alex Johnson</h3>
            <p className="text-muted-foreground">10,250 points</p>
            <Badge variant="secondary" className="mt-1 bg-primary/10">
              Champion Learner
            </Badge>
          </div>

          {/* 3rd Place */}
          <div className="order-2 flex flex-col items-center md:order-2">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#CD7F32] text-white">
              <Award className="h-8 w-8" />
            </div>
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback>3</AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#CD7F32] text-white">
                <span className="text-lg font-bold">3</span>
              </div>
            </div>
            <h3 className="mt-2 text-lg font-semibold">Marcus Williams</h3>
            <p className="text-sm text-muted-foreground">9,200 points</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="weekly" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              This Week
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Your Rank: #42
            </Button>
          </div>
        </div>

        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Weekly Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg p-3 ${i < 3 ? "bg-primary/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          i === 0 ? "bg-[#FFD700]" : i === 1 ? "bg-[#C0C0C0]" : i === 2 ? "bg-[#CD7F32]" : "bg-muted"
                        } text-sm font-medium ${i < 3 ? "text-white" : "text-foreground"}`}
                      >
                        {i + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {["Alex Johnson", "Sophia Chen", "Marcus Williams"][i] || `User ${i + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {i < 3 ? (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-primary" />
                              Champion Learner
                            </span>
                          ) : (
                            `Level ${Math.floor(Math.random() * 5) + 1} Learner`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{10250 - i * 350} pts</div>
                      <div className="text-xs text-muted-foreground">
                        {`+${Math.floor(Math.random() * 500) + 100} this week`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                View More
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-center">
                <div>
                  <Calendar className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Monthly rankings update soon</h3>
                  <p className="text-muted-foreground">Check back on the 1st of next month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alltime">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Time Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg p-3 ${i < 3 ? "bg-primary/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          i === 0 ? "bg-[#FFD700]" : i === 1 ? "bg-[#C0C0C0]" : i === 2 ? "bg-[#CD7F32]" : "bg-muted"
                        } text-sm font-medium ${i < 3 ? "text-white" : "text-foreground"}`}
                      >
                        {i + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {["Alex Johnson", "Sophia Chen", "Marcus Williams"][i] || `User ${i + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {i < 3 ? (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-primary" />
                              Champion Learner
                            </span>
                          ) : (
                            `Level ${Math.floor(Math.random() * 5) + 1} Learner`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{50250 - i * 2350} pts</div>
                      <div className="text-xs text-muted-foreground">
                        {`${Math.floor(Math.random() * 100) + 10} achievements`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                View More
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

