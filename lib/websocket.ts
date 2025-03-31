import { create } from 'zustand'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface ChatState {
  messages: Message[]
  activeConversation: string | null
  addMessage: (message: Message) => void
  setActiveConversation: (conversationId: string) => void
  markMessageAsRead: (messageId: string) => void
}

export const useChatStore = create<ChatState>((set: any) => ({
  messages: [],
  activeConversation: null,
  addMessage: (message: Message) =>
    set((state: ChatState) => ({
      messages: [...state.messages, message],
    })),
  setActiveConversation: (conversationId: string) =>
    set(() => ({
      activeConversation: conversationId,
    })),
  markMessageAsRead: (messageId: string) =>
    set((state: ChatState) => ({
      messages: state.messages.map((msg: Message) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ),
    })),
}))

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 3000
  private currentUserId: string | null = null

  constructor(private url: string) {}

  connect(userId: string) {
    try {
      this.currentUserId = userId
      this.ws = new WebSocket(`${this.url}?userId=${userId}`)
      this.setupEventListeners()
      this.reconnectAttempts = 0
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.handleReconnect()
    }
  }

  private setupEventListeners() {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('WebSocket connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        useChatStore.getState().addMessage(message)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.handleReconnect()
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  private handleReconnect() {
    if (!this.currentUserId) return

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
        this.connect(this.currentUserId as string)
      }, this.reconnectTimeout)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.currentUserId = null
  }
}

// Create a singleton instance
export const wsService = new WebSocketService(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001') 