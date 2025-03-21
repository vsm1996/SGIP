'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import apiClient from '@/app/services/api-client'
import Comments from './comments'
import { formatDistanceToNow } from 'date-fns'
import ErrorMessage from '../errorMessage'
import { useRouter } from 'next/navigation'

interface PostProps {
  post: {
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
    likes: Array<{
      userId: string
    }>
    comments: Array<{
      id: string
    }>
    mentionContext?: {
      type: string
      message: string
      user: {
        username: string
        firstName: string
        name: string
      }
    }
  }
  handleFetch: () => void
}

const Post = ({ post, handleFetch }: PostProps) => {
  const { data: session } = useSession()
  const [showComments, setShowComments] = useState(false)
  const [error, setError] = useState<string[]>([])
  const router = useRouter()

  const likes = post?.likes || []
  const comments = post?.comments || []
  const isLiked = likes.some(like => like.userId === session?.sub)
  const likesCount = likes.length
  const commentsCount = comments.length

  if (!post?.id || !post?.user) {
    return (
      <div className="alert alert-error">
        <span>Invalid post data</span>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!session?.sub) {
      setError(['Please sign in to delete posts'])
      return
    }

    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await apiClient.delete(`/post/${post.id}`)
      handleFetch()
    } catch (err: any) {
      console.error('Error deleting post:', err)
      setError([err.response?.data?.message || 'Failed to delete post'])
    }
  }

  const handleLike = async () => {
    if (!session?.sub) {
      setError(['Please sign in to like posts'])
      return
    }

    try {
      if (isLiked) {
        await apiClient.delete(`/post/${post.id}/like/${session.sub}`)
      } else {
        await apiClient.post(`/post/${post.id}/like`, { userId: session.sub })
      }
      handleFetch()
    } catch (err: any) {
      console.error('Error liking post:', err)
      setError([err.response?.data?.message || 'Failed to like post'])
    }
  }

  return (
    <div className='space-y-4'>
      {error.length > 0 && <ErrorMessage error={error} />}

      <div className='flex items-start gap-3'>
        <img
          src={post.user.image || '/default-avatar.png'}
          alt={post.user.name}
          className='w-10 h-10 rounded-full'
        />
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <span className='font-semibold'>{post.user.name}</span>
            <span className='text-base-content/60 text-sm'>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          {post.mentionContext && (
            <div className='mt-2 p-3 bg-base-300 rounded-lg text-sm'>
              <p className='text-base-content/70 mb-1'>
                Replying to @{post.mentionContext.user.username}
              </p>
              <p>{post.mentionContext.message}</p>
            </div>
          )}

          <p className='mt-2'>{post.message}</p>

          <div className='mt-4 flex items-center gap-6'>
            <button
              onClick={handleLike}
              className='btn btn-ghost btn-sm gap-2'
              disabled={!session?.sub}
            >
              {isLiked ? (
                <HeartIconSolid className='w-5 h-5 text-error' />
              ) : (
                <HeartIcon className='w-5 h-5' />
              )}
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className='btn btn-ghost btn-sm gap-2'
            >
              <span>Comments</span>
              <span>{commentsCount}</span>
            </button>

            {session?.user?.id === post.userId && (
              <button
                onClick={handleDelete}
                className='btn btn-ghost btn-sm text-error'
                title='Delete post'
              >
                <TrashIcon className='w-5 h-5' />
              </button>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className='mt-4 pl-12'>
          <Comments postId={post.id} />
        </div>
      )}
    </div>
  )
}

export default Post
