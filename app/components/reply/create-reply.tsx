'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import apiClient from '@/app/services/api-client'
import { nunito } from '@/app/utils/font'

interface CreateReplyProps {
  commentId: string
  postId: string
  onReplyCreated: () => void
}

const CreateReply = ({ commentId, postId, onReplyCreated }: CreateReplyProps) => {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsLoading(true)
    setError([])

    try {
      await apiClient.post(`/post/${postId}/comments/${commentId}/replies`, {
        message: message.trim()
      })
      setMessage('')
      onReplyCreated()
    } catch (err: any) {
      setError([err.response?.data?.message || 'Failed to post reply'])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mt-2'>
      <div className='flex flex-col gap-2'>
        <textarea
          className={`textarea textarea-bordered w-full ${nunito.className}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={session?.user ? 'Write a reply...' : 'Sign in to reply'}
          disabled={!session?.user || isLoading}
          rows={2}
        />
        {error.length > 0 && (
          <div className='text-error text-sm'>
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
        <button
          type='submit'
          className='btn btn-primary w-fit self-end'
          disabled={!session?.user || isLoading || !message.trim()}
        >
          {isLoading ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  )
}

export default CreateReply