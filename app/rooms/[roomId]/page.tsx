'use client'

import { useSession } from 'next-auth/react'
import ChatRoom from '@/app/components/discussion/ChatRoom'

interface RoomPageProps {
  params: {
    roomId: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Discussion Room</h1>
        <p>Please sign in to join the discussion.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChatRoom roomId={params.roomId} />
    </div>
  )
} 