'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import apiClient from '@/app/services/api-client'
import { formatDistanceToNow } from 'date-fns'
import { TrashIcon } from '@heroicons/react/24/outline'
import ErrorMessage from '../errorMessage'

interface Comment {
  id: string
  message: string
  createdAt: string
  userId: string
  user: {
    id: string
    name: string
    username: string
    firstName: string
    image: string | null
  }
}

interface CommentsProps {
  postId: string
}

const Comments = ({ postId }: CommentsProps) => {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string[]>([])

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/post/${postId}/comments`)
      setComments(response.data)
    } catch (err: any) {
      console.error('Error fetching comments:', err)
      setError([err.response?.data?.message || 'Failed to load comments'])
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return
    if (!newComment.trim()) return

    setIsLoading(true)
    setError([])

    try {
      await apiClient.post(`/post/${postId}/comments`, {
        message: newComment.trim()
      })
      setNewComment('')
      fetchComments()
    } catch (err: any) {
      console.error('Error posting comment:', err)
      setError([err.response?.data?.message || 'Failed to post comment'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!session?.user) return

    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await apiClient.delete(`/post/${postId}/comments/${commentId}`)
      fetchComments()
    } catch (err: any) {
      console.error('Error deleting comment:', err)
      setError([err.response?.data?.message || 'Failed to delete comment'])
    }
  }

  return (
    <div className='space-y-4'>
      {error.length > 0 && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit} className='space-y-2'>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={session?.user ? 'Write a comment...' : 'Sign in to comment'}
          disabled={!session?.user || isLoading}
          className='textarea textarea-bordered w-full'
          rows={2}
        />
        <button
          type='submit'
          disabled={!session?.user || isLoading || !newComment.trim()}
          className='btn btn-primary btn-sm'
        >
          {isLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className='space-y-4'>
        {comments.map((comment) => (
          <div key={comment.id} className='flex items-start gap-3'>
            <img
              src={comment.user.image || '/default-avatar.png'}
              alt={comment.user.name}
              className='w-8 h-8 rounded-full'
            />
            <div className='flex-1'>
              <div className='bg-base-300 rounded-lg p-3'>
                <div className='flex items-center justify-between gap-2 mb-1'>
                  <span className='font-semibold'>{comment.user.name}</span>
                  <span className='text-base-content/60 text-sm'>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p>{comment.message}</p>
              </div>
              {session?.user?.id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className='btn btn-ghost btn-xs text-error mt-1'
                  title='Delete comment'
                >
                  <TrashIcon className='w-4 h-4' />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments 