'use client'

import Link from 'next/link'
import { timeAgo } from '@/app/utils'

interface User {
  id: string
  username?: string
  firstName?: string
  image?: string
}

interface Room {
  id: string
  title: string
  createdAt: string
  createdBy: User
  participants: User[]
  _count: {
    messages: number
  }
}

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const getDisplayName = (user: User) => {
    return user.username || user.firstName || 'Anonymous'
  }

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="card bg-base-200 hover:bg-base-300 transition-colors"
    >
      <div className="card-body">
        <h2 className="card-title">{room.title}</h2>
        <p className="text-sm opacity-70">
          Created by {getDisplayName(room.createdBy)} {timeAgo(room.createdAt)}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm">
            {room._count.messages} messages
          </span>
          <span className="text-sm">
            {room.participants.length} participants
          </span>
        </div>
      </div>
    </Link>
  )
}