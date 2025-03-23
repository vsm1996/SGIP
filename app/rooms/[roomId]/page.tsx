'use client'

import { useSession } from 'next-auth/react'
import ChatRoom from '@/app/components/discussion/ChatRoom'
import { use } from 'react'

interface RoomPageProps {
  params: Promise<{
    roomId: string
  }>
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = use(params)
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
      <ChatRoom roomId={roomId} />
    </div>
  )
}