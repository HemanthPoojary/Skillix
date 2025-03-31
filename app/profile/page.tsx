import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Settings, Award, BookOpen, Users, Bookmark, Share2 } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Cover Photo */}
        <div className="h-48 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 md:h-64">
          <div className="h-full w-full bg-black/20"></div>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 flex flex-col items-center px-4 sm:flex-row sm:items-end sm:px-6">
          <div className="z-10 h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-background">
            <img
              src="/placeholder.svg?height=128&width=128"
              alt="Profile picture"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-4 flex flex-1 flex-col items-center text-center sm:ml-4 sm:items-start sm:text-left">
            <h1 className="text-2xl font-bold">Alex Johnson</h1>
            <p className="text-muted-foreground">@alexj</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/10">
                Math Enthusiast
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                Science Lover
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                Coding Beginner
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button size="sm" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <span className="text-3xl font-bold text-primary">1.2K</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <span className="text-3xl font-bold text-primary">450</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <span className="text-3xl font-bold text-primary">32</span>
            <span className="text-sm text-muted-foreground">Posts</span>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <span className="text-3xl font-bold text-primary">8.5K</span>
            <span className="text-sm text-muted-foreground">Points</span>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Award className="h-5 w-5 text-primary" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <span className="text-center text-sm font-medium">
                {
                  ["Math Wizard", "Science Pro", "Coding Ninja", "Quiz Master", "Helpful Peer", "Content Creator"][
                    i - 1
                  ]
                }
              </span>
              <span className="text-xs text-muted-foreground">Level {Math.floor(Math.random() * 5) + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Connections</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={`/placeholder.svg?height=200&width=300`}
                    alt={`Post ${i}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">
                    {
                      [
                        "How to Solve Quadratic Equations",
                        "Chemistry Lab Results",
                        "My Coding Journey",
                        "History Quiz Challenge",
                        "Book Review",
                        "Science Project",
                      ][i - 1]
                    }
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{Math.floor(Math.random() * 1000) + 100} views</span>
                    <span>{Math.floor(Math.random() * 30) + 1} days ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Bookmark className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">No saved content yet</h3>
            <p className="mb-4 text-muted-foreground">Items you save will appear here</p>
            <Button>Browse Content</Button>
          </div>
        </TabsContent>

        <TabsContent value="connections">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <img
                        src={`/placeholder.svg?height=48&width=48`}
                        alt={`Connection ${i}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">User {i}</h3>
                      <p className="text-xs text-muted-foreground">@user{i}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Message
                    </Button>
                    <Button size="sm" className="flex-1">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Display Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="Alex Johnson"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Bio</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    rows={3}
                    defaultValue="Math enthusiast and science lover. Always learning!"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Math
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Science
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Coding
                    </Badge>
                    <Button variant="outline" size="sm" className="h-6">
                      + Add
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

