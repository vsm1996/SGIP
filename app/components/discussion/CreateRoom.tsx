'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = roomName.trim()

    if (!trimmedName) {
      setError('Room name cannot be empty')
      return
    }

    if (trimmedName.length < 3) {
      setError('Room name must be at least 3 characters long')
      return
    }

    if (trimmedName.length > 50) {
      setError('Room name must be less than 50 characters')
      return
    }

    // Create a URL-friendly room ID from the name
    const roomId = encodeURIComponent(trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    router.push(`/discussion/${roomId}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value)
            setError(null)
          }}
          placeholder="Enter room name"
          className={`input input-bordered w-full max-w-xs ${error ? 'input-error' : ''}`}
          maxLength={50}
          required
        />
        <button type="submit" className="btn btn-primary">
          Create Room
        </button>
      </form>
      {error && (
        <div className="text-error text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  )
} 