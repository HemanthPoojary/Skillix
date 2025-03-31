import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Video, BookOpen, Filter } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Python Coding Challenge",
    type: "challenge",
    date: "May 15, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Virtual",
    description:
      "Test your Python skills in this timed coding challenge. Solve problems and compete with peers for prizes!",
    participants: 128,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Science Fair Live Stream",
    type: "webinar",
    date: "May 18, 2025",
    time: "2:30 PM - 4:00 PM",
    location: "Virtual",
    description:
      "Watch live presentations from top science fair projects and learn about cutting-edge research by students.",
    participants: 256,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Math Problem Solving Workshop",
    type: "workshop",
    date: "May 20, 2025",
    time: "5:00 PM - 6:30 PM",
    location: "Virtual",
    description: "Learn advanced techniques for solving complex math problems with our expert tutors.",
    participants: 89,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "History Trivia Night",
    type: "challenge",
    date: "May 22, 2025",
    time: "7:00 PM - 8:30 PM",
    location: "Virtual",
    description: "Test your knowledge of world history in this fun and educational trivia competition.",
    participants: 112,
    image: "/placeholder.svg?height=200&width=400",
  },
]

const pastEvents = [
  {
    id: 101,
    title: "AI Ethics Panel Discussion",
    type: "webinar",
    date: "April 28, 2025",
    time: "3:00 PM - 4:30 PM",
    location: "Virtual",
    participants: 342,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 102,
    title: "Creative Writing Workshop",
    type: "workshop",
    date: "April 25, 2025",
    time: "5:00 PM - 6:30 PM",
    location: "Virtual",
    participants: 76,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Events & Challenges</h1>
        <p className="text-muted-foreground">Join live events, workshops, and challenges to boost your skills</p>
      </div>

      {/* Featured Event */}
      <div className="mb-8">
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="aspect-[21/9] w-full bg-muted">
              <img
                src="/placeholder.svg?height=400&width=1200"
                alt="Featured event"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <Badge className="mb-2 bg-primary">Featured Event</Badge>
              <h2 className="mb-2 text-3xl font-bold">Global Science Olympiad 2025</h2>
              <p className="mb-4 max-w-2xl text-white/90">
                Compete with students worldwide in this prestigious science competition. Showcase your knowledge and win
                scholarships and prizes!
              </p>
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>June 10-12, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Multiple sessions</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Virtual Event</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>1,200+ participants</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button>Register Now</Button>
                <Button variant="outline" className="bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="registered">Registered</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </Button>
          </div>
        </div>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10">
                      {event.type === "challenge" ? "Challenge" : event.type === "webinar" ? "Webinar" : "Workshop"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 line-clamp-1">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                  <Button size="sm">Register</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registered">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <BookOpen className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">No registered events</h3>
            <p className="mb-4 text-muted-foreground">You haven't registered for any upcoming events yet</p>
            <Button>Browse Events</Button>
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="h-full w-full object-cover opacity-70"
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-muted">
                      {event.type === "challenge" ? "Challenge" : event.type === "webinar" ? "Webinar" : "Workshop"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 line-clamp-1">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" size="sm">
                    View Recording
                  </Button>
                  <Button variant="secondary" size="sm">
                    Certificate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Now Section */}
      <div className="mt-10">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Video className="h-6 w-6 text-primary" />
          Live Now
        </h2>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Live event"
                  className="h-full w-full object-cover"
                />
                <div className="relative">
                  <div className="absolute left-4 top-4 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                    LIVE
                  </div>
                  <div className="absolute bottom-4 right-4 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    256 watching
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <Badge className="mb-2">Live Webinar</Badge>
                  <h3 className="mb-2 text-xl font-bold">Understanding Quantum Computing Basics</h3>
                  <p className="mb-4 text-muted-foreground">
                    Join Dr. Emily Chen as she explains the fundamental concepts of quantum computing in an accessible
                    way for students.
                  </p>

                  <div className="mb-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>EC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Dr. Emily Chen</div>
                      <div className="text-xs text-muted-foreground">Quantum Physics Professor</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">Join Now</Button>
                  <Button variant="outline" className="flex-1">
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

