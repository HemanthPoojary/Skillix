import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Python Coding Challenge",
    date: "May 15, 2025",
    time: "4:00 PM",
    participants: 128,
  },
  {
    id: 2,
    title: "Science Fair Live Stream",
    date: "May 18, 2025",
    time: "2:30 PM",
    participants: 256,
  },
  {
    id: 3,
    title: "Math Problem Solving",
    date: "May 20, 2025",
    time: "5:00 PM",
    participants: 89,
  },
]

export default function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="space-y-2">
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{event.date}</span>
                <Clock className="ml-2 h-3 w-3" />
                <span>{event.time}</span>
              </div>
              <div className="text-xs text-muted-foreground">{event.participants} participants</div>
              <Button variant="outline" size="sm" className="w-full">
                Join Event
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

