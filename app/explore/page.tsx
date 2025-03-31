import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TrendingTopics from "@/components/trending-topics"
import UpcomingEvents from "@/components/upcoming-events"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, TrendingUp, Calendar, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-muted-foreground">Discover trending topics, upcoming events, and connect with others</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input type="search" placeholder="Search topics, events, or users..." className="pl-10 py-6 text-lg" />
      </div>

      {/* Tabs for different explore sections */}
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>People</span>
          </TabsTrigger>
        </TabsList>

        {/* Trending Topics Tab */}
        <TabsContent value="trending">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Popular Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          #{i}
                        </div>
                        <div>
                          <div className="font-medium">
                            {
                              [
                                "Quantum Physics",
                                "AI Ethics",
                                "Climate Science",
                                "Coding Challenges",
                                "Space Exploration",
                                "Neuroscience",
                                "Renewable Energy",
                                "Digital Art",
                              ][i - 1]
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {`${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}k posts`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Trending Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="aspect-video w-full bg-muted">
                          <img
                            src={`/placeholder.svg?height=200&width=300`}
                            alt={`Trending content ${i}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="mb-2 font-semibold">
                            {
                              [
                                "The Future of AI in Education",
                                "Understanding Climate Change",
                                "Coding for Beginners",
                                "The Science of Learning",
                              ][i - 1]
                            }
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                                <AvatarFallback>U{i}</AvatarFallback>
                              </Avatar>
                              <span>User {i}</span>
                            </div>
                            <span>{Math.floor(Math.random() * 10) + 1}k views</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <TrendingTopics />
              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "science",
                        "math",
                        "coding",
                        "history",
                        "literature",
                        "art",
                        "physics",
                        "chemistry",
                        "biology",
                        "technology",
                        "engineering",
                        "languages",
                      ].map((tag) => (
                        <Button key={tag} variant="outline" size="sm" className="rounded-full">
                          #{tag}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-5 w-5 text-primary" />
                    Featured Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="grid md:grid-cols-3">
                          <div className="aspect-video md:aspect-square w-full bg-muted">
                            <img
                              src={`/placeholder.svg?height=200&width=200`}
                              alt={`Event ${i}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="md:col-span-2 p-4">
                            <h3 className="text-lg font-semibold mb-2">
                              {["Science Fair Live Stream", "Coding Bootcamp", "Math Olympiad Preparation"][i - 1]}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {
                                [
                                  "Watch live presentations from top science fair projects and learn about cutting-edge research by students.",
                                  "Join our intensive coding bootcamp and learn the fundamentals of programming in just one week!",
                                  "Prepare for the upcoming Math Olympiad with expert guidance and practice problems.",
                                ][i - 1]
                              }
                            </p>
                            <div className="flex flex-col gap-1 text-sm mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{["May 18, 2025", "May 20-27, 2025", "June 5, 2025"][i - 1]}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{[256, 128, 192][i - 1]} participants</span>
                              </div>
                            </div>
                            <Button>Register Now</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <UpcomingEvents />
              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Event Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {["Webinars", "Challenges", "Workshops", "Competitions", "Study Groups", "Q&A Sessions"].map(
                        (category) => (
                          <Button key={category} variant="outline" className="w-full justify-start" size="sm">
                            {category}
                          </Button>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* People Tab */}
        <TabsContent value="people">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5 text-primary" />
                    People to Follow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {
                                [
                                  "Alex Johnson",
                                  "Sophia Chen",
                                  "Marcus Williams",
                                  "Priya Patel",
                                  "James Wilson",
                                  "Emma Rodriguez",
                                ][i - 1]
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {
                                [
                                  "Math Enthusiast",
                                  "Science Lover",
                                  "Coding Expert",
                                  "Literature Fan",
                                  "History Buff",
                                  "Art Creator",
                                ][i - 1]
                              }
                            </div>
                          </div>
                        </div>
                        <Button size="sm">Follow</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Suggested Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Suggested User {i}</div>
                            <div className="text-xs text-muted-foreground">Similar interests</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View More
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Browse by Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Mathematics",
                      "Science",
                      "Programming",
                      "Literature",
                      "History",
                      "Art",
                      "Music",
                      "Languages",
                    ].map((interest) => (
                      <Button key={interest} variant="outline" size="sm" className="rounded-full">
                        {interest}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

