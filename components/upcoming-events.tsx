"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { getUpcomingEvents } from "@/lib/supabase"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  date: string
  time_start: string
  time_end: string
  location: string
  is_virtual: boolean
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        const eventsData = await getUpcomingEvents(3) // Fetch top 3 upcoming events
        setEvents(eventsData || [])
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  const formatTime = (timeStart: string, timeEnd: string) => {
    try {
      // Convert from 24h format "HH:MM:SS" to display format
      const start = new Date(`1970-01-01T${timeStart}Z`)
      const end = new Date(`1970-01-01T${timeEnd}Z`)
      
      return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
    } catch (e) {
      return `${timeStart} - ${timeEnd}`
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMMM d, yyyy")
    } catch (e) {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            Loading events...
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
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
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
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No upcoming events
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="space-y-2">
                <h3 className="font-medium">{event.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(event.date)}</span>
                  <Clock className="ml-2 h-3 w-3" />
                  <span>{formatTime(event.time_start, event.time_end)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.is_virtual ? "Virtual Event" : event.location}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Join Event
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

