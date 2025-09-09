'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { usePartySocket } from 'partysocket/react'
import type { PartySocketOptions } from 'partysocket'
import { timeAgo } from '@/app/utils'

interface Message {
  id: string
  text: string
  userId: string
  username?: string
  firstName?: string
  name?: string
  createdAt: Date
}

interface RoomData {
  id: string
  title: string
  createdAt: Date
  creatorId: string
}

interface ChatRoomProps {
  roomId: string
}

const ChatRoom = ({ roomId }: ChatRoomProps) => {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [roomData, setRoomData] = useState<RoomData | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST
  if (!host) {
    console.error('NEXT_PUBLIC_PARTYKIT_HOST is not set')
  }

  // Ensure host is properly formatted
  const formattedHost = host?.startsWith('http://') || host?.startsWith('https://')
    ? host.replace(/^https?:\/\//, '')
    : host || 'localhost:1999'

  useEffect(() => {
    // console.log('Initializing chat for room:', roomId)
    // console.log('Using PartyKit host:', formattedHost)
    // console.log('Current session:', session)
  }, [formattedHost, roomId, session])

  // Add connection status tracking
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')

  const socket = usePartySocket({
    host: formattedHost,
    room: roomId,
    party: 'room',
    headers: session?.sub ? {
      'X-User-ID': session.sub
    } : undefined,
    onOpen: () => {
      // console.log(`WebSocket connected to ${formattedHost} for room ${roomId}`)
      // console.log('Connection details:', {
      //   host: formattedHost,
      //   room: roomId,
      //   party: 'room'
      // })
      setError(null)
      setIsConnecting(false)
      setConnectionAttempts(0)
      setConnectionStatus('connected')
    },
    onClose: (event: CloseEvent) => {
      // console.log('WebSocket disconnected:', {
      //   code: event.code,
      //   reason: event.reason,
      //   wasClean: event.wasClean,
      //   timestamp: new Date().toISOString()
      // })
      setConnectionAttempts(prev => prev + 1)
      setError(`Connection closed (attempt ${connectionAttempts + 1}/5). ${event.reason || 'Attempting to reconnect...'}`)
      setIsConnecting(true)
      setConnectionStatus('disconnected')
    },
    onError: (error: Event) => {
      console.error('WebSocket error details:', {
        error,
        type: error.type,
        timestamp: new Date().toISOString(),
        target: error.target,
        currentTarget: error.currentTarget,
        message: error instanceof ErrorEvent ? error.message : 'Unknown error',
        isTrusted: error.isTrusted
      })

      let errorMessage = 'Unknown error'
      if (error instanceof ErrorEvent) {
        errorMessage = error.message
      } else if (error instanceof Event) {
        errorMessage = `Connection failed (${error.type})`
      }

      setError(`Connection error (attempt ${connectionAttempts + 1}/5): ${errorMessage}`)
      setIsConnecting(true)
      setConnectionStatus('error')
    },
    reconnectBackoffMs: (retryCount: number) => Math.min(1000 * Math.pow(2, retryCount), 10000),
    reconnectMaxAttempts: 5
  } as PartySocketOptions)

  // Add connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      if (socket.readyState === WebSocket.CLOSED) {
        // console.log('Socket is closed, attempting to reconnect...')
        socket.reconnect()
      } else if (socket.readyState === WebSocket.CONNECTING && connectionStatus !== 'connecting') {
        setConnectionStatus('connecting')
        setIsConnecting(true)
      } else if (socket.readyState === WebSocket.OPEN && connectionStatus !== 'connected') {
        setConnectionStatus('connected')
        setIsConnecting(false)
        setError(null)
      }
    }

    const interval = setInterval(checkConnection, 5000)
    return () => clearInterval(interval)
  }, [socket, connectionStatus])

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        // console.log('Received message:', event.data)
        const data = JSON.parse(event.data)

        if (data.type === 'sync') {
          // console.log('Syncing messages:', data.messages?.length || 0, 'messages')
          setMessages(data.messages || [])
          if (data.roomData) {
            setRoomData(data.roomData)
          }
        } else if (data.type === 'message') {
          // console.log('New message received:', data.message)
          setMessages(prev => [...prev, data.message])
        } else if (data.type === 'error') {
          console.error('Server error:', data.message)
          setError(data.message || 'An error occurred')
        }
      } catch (err) {
        console.error('Error parsing message:', err)
        setError('Error receiving message. Please refresh the page.')
      }
    }

    socket.addEventListener('message', handleMessage)
    return () => socket.removeEventListener('message', handleMessage)
  }, [socket])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user || !newMessage.trim() || !session?.sub) return

    try {
      socket.send(JSON.stringify({
        type: 'message',
        text: newMessage.trim(),
        userId: session.sub,
        username: session.user.username || session.user.name,
        name: session.user.name,
        firstName: session.user.firstName || session.user.name
      }))



      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Error sending message. Please try again.')
    }
  }

  const getDisplayName = (message: Message) => {
    return message.username || message.name || message.firstName || 'Anonymous'
  }

  return (
    <div className="flex flex-col h-[600px] bg-base-200/95 backdrop-blur-sm rounded-lg shadow-lg border border-base-300">
      {roomData && (
        <div className="bg-base-300/90 p-4 rounded-t-lg border-b border-base-300">
          <h2 className="text-xl font-bold">{roomData.title}</h2>
          <p className="text-sm opacity-70">Created {timeAgo(roomData.createdAt)}</p>
        </div>
      )}
      {error && (
        <div className="alert alert-error shadow-lg m-4">
          <div>
            <span>{error}</span>
            {connectionStatus === 'error' && (
              <button
                className="btn btn-xs btn-outline ml-2"
                onClick={() => socket.reconnect()}
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
      {isConnecting && (
        <div className="alert alert-warning shadow-lg m-4">
          <div>
            <span>Connecting to chat server... {connectionAttempts > 0 ? `(Attempt ${connectionAttempts}/5)` : ''}</span>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`chat ${message.userId === session?.sub ? 'chat-end' : 'chat-start'}`}
          >
            <div className="chat-header">
              {getDisplayName(message)}
              <time className="text-xs opacity-50 ml-1">
                {timeAgo(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble transition-colors duration-200 ${message.userId === session?.sub ? 'chat-bubble-primary' : ''}`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-base-300/90 rounded-b-lg border-t border-base-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={session ? "Type a message..." : "Please sign in to chat"}
            className="input input-bordered flex-1"
            disabled={!session || isConnecting}
          />
          <button
            type="submit"
            className="btn btn-primary shadow-md hover:shadow-lg transition-all duration-200"
            disabled={!session || !newMessage.trim() || isConnecting}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatRoom