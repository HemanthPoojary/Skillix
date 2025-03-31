import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { IncomingMessage } from 'http'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface Client {
  id: string
  ws: WebSocket
}

const wss = new WebSocketServer({ port: 3001 })
const clients = new Map<string, Client>()

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const userId = new URL(req.url || '', 'ws://localhost').searchParams.get('userId')
  
  if (!userId) {
    ws.close(1008, 'User ID is required')
    return
  }

  // Store client connection
  clients.set(userId, { id: userId, ws })

  console.log(`Client connected: ${userId}`)

  ws.on('message', (data: Buffer) => {
    try {
      const message: Omit<Message, 'id' | 'timestamp'> = JSON.parse(data.toString())
      
      // Create full message object
      const fullMessage: Message = {
        ...message,
        id: uuidv4(),
        timestamp: new Date(),
      }

      // Send message to receiver if they're connected
      const receiver = clients.get(message.receiverId)
      if (receiver) {
        receiver.ws.send(JSON.stringify(fullMessage))
      }

      // Send confirmation back to sender
      ws.send(JSON.stringify(fullMessage))
    } catch (error) {
      console.error('Error processing message:', error)
      ws.send(JSON.stringify({ error: 'Failed to process message' }))
    }
  })

  ws.on('close', () => {
    clients.delete(userId)
    console.log(`Client disconnected: ${userId}`)
  })

  ws.on('error', (error: Error) => {
    console.error(`WebSocket error for client ${userId}:`, error)
    clients.delete(userId)
  })
})

console.log('WebSocket server is running on port 3001') 