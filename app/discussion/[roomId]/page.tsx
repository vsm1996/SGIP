'use client'

import ChatRoom from '@/app/components/discussion/ChatRoom'
import { useParams } from 'next/navigation'

export default function DiscussionPage() {
  const params = useParams()
  const roomId = params.roomId as string

  if (!roomId) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <div>
            <span>Invalid room ID</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Display the room name by decoding the URI-encoded roomId and replacing hyphens with spaces */}
      <h1 className="text-2xl font-bold mb-4">
        Discussion: {decodeURIComponent(roomId).replace(/-/g, ' ')}
      </h1>
      <ChatRoom roomId={roomId} />
    </div>
  )
}
