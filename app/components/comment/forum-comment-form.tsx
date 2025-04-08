'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

interface CommentFormProps {
  forumSlug: string
  postId: string
  onCommentAdded: () => void
}

const ForumCommentForm = ({ forumSlug, postId, onCommentAdded }: CommentFormProps) => {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !message.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/forums/${forumSlug}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add comment')
      }

      setMessage('')
      onCommentAdded()
    } catch (err) {
      console.error('Error adding comment:', err)
      setError(err instanceof Error ? err.message : 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="p-4 bg-base-200 rounded-lg mb-4 text-center">
        <p>Please sign in to comment</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment..."
          className="textarea textarea-bordered w-full h-24"
          disabled={isSubmitting}
          required
        />
      </div>

      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!message.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}

export default ForumCommentForm