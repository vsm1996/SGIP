'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RoomCard from '@/components/discussion/RoomCard'

interface User {
  id: string
  username?: string
  firstName?: string
  image?: string
}

interface Message {
  id: String
  text: String
  createdAt: Date
  room: Room
  roomId: String
  author: User
  authorId: String
}

interface Room {
  id: string
  title: string
  createdAt: string
  createdBy: User
  participants: User[]
  messages: Message[]
}

export default function RoomsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newRoomTitle, setNewRoomTitle] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      if (!response.ok) {
        throw new Error('Failed to fetch rooms')
      }
      const data = await response.json()
      setRooms(data)
    } catch (err) {
      setError('Failed to load discussion rooms')
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomTitle.trim() || creating) return

    setCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newRoomTitle }),
      })

      if (!response.ok) {
        throw new Error('Failed to create room')
      }

      const room = await response.json()
      setRooms(prev => [room, ...prev])
      setNewRoomTitle('')
      router.push(`/rooms/${room.id}`)
    } catch (err) {
      setError('Failed to create discussion room')
      console.error('Error creating room:', err)
    } finally {
      setCreating(false)
    }
  }

  const getDisplayName = (user: User) => {
    return user.username || user.firstName || 'Anonymous'
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Discussion Rooms</h1>
        <p>Please sign in to view and join discussion rooms.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Discussion Rooms</h1>
        <form onSubmit={handleCreateRoom} className="flex gap-4">
          <input
            type="text"
            value={newRoomTitle}
            onChange={(e) => setNewRoomTitle(e.target.value)}
            placeholder="Enter room title..."
            className="input input-bordered"
            disabled={creating}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newRoomTitle.trim() || creating}
          >
            {creating ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-8">
          <p>No discussion rooms yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}