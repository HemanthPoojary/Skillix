"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, ImageIcon, Paperclip, Smile, MoreVertical, Phone, Video, Info } from "lucide-react"
import { useChatStore, wsService } from "@/lib/websocket"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

// Mock conversations data - in a real app, this would come from an API
const conversations = [
  {
    id: "1",
    name: "Sophia Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you help me with the math problem?",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Marcus Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for sharing the notes!",
    time: "1h ago",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Are you joining the study group?",
    time: "3h ago",
    unread: 1,
    online: true,
  },
  {
    id: "4",
    name: "Study Group",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Alex: I'll share my notes later",
    time: "5h ago",
    unread: 0,
    online: false,
    isGroup: true,
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const { messages, addMessage, setActiveConversation: setStoreActiveConversation, markMessageAsRead } = useChatStore()

  // Mock current user ID - in a real app, this would come from auth
  const currentUserId = "current-user"

  useEffect(() => {
    // Connect to WebSocket when component mounts
    wsService.connect(currentUserId)

    // Cleanup on unmount
    return () => {
      wsService.disconnect()
    }
  }, [currentUserId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      senderId: currentUserId,
      receiverId: activeConversation.id,
      content: newMessage.trim(),
      isRead: false,
    }

    wsService.sendMessage(message)
    setNewMessage("")
  }

  const handleConversationSelect = (conversation: typeof conversations[0]) => {
    setActiveConversation(conversation)
    setStoreActiveConversation(conversation.id)
    // Mark messages as read when selecting a conversation
    messages
      .filter((msg) => !msg.isRead && msg.receiverId === currentUserId && msg.senderId === conversation.id)
      .forEach((msg) => markMessageAsRead(msg.id))
  }

  const conversationMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.receiverId === activeConversation.id) ||
      (msg.senderId === activeConversation.id && msg.receiverId === currentUserId)
  )

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] px-4 py-6">
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
        {/* Conversations List */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="flex h-full flex-col rounded-lg border">
            <div className="border-b p-4">
              <h2 className="mb-4 text-xl font-bold">Messages</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search conversations..." className="pl-8" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted ${
                    activeConversation.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {conversation.name}
                        {conversation.isGroup && (
                          <Badge variant="outline" className="ml-2 bg-primary/10">
                            Group
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</div>
                  </div>

                  {conversation.unread > 0 && (
                    <Badge className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="flex h-full flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeConversation.avatar} />
                  <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{activeConversation.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {activeConversation.online ? (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Online
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.senderId === currentUserId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.senderId !== currentUserId && (
                        <div className="mb-1 text-xs font-medium">{activeConversation.name}</div>
                      )}
                      <div>{message.content}</div>
                      <div
                        className={`mt-1 text-right text-xs ${
                          message.senderId === currentUserId
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

