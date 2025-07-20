'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import apiClient from '@/services/api-client'
import { AxiosError } from 'axios'
import Post from '@/components/post'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/errorMessage'
import dynamic from 'next/dynamic'

const DynamicPost = dynamic(() => import('@/components/post'), { ssr: false })

interface User {
  id: string
  name: string
  username: string
  firstName: string
  image: string | null
}

interface Post {
  id: string
  message: string
  createdAt: string
  userId: string
  user: User
  likes: Array<{ userId: string }>
  comments: Array<{ id: string }>
}

interface Mention {
  id: string
  post?: Post
  comment?: {
    message: string
    user: User
    post: Post
  }
  commentReply?: {
    message: string
    user: User
    comment: {
      id: string
      post: Post,
      message: string,
      user: User
    }
  }
}

const MentionsPage = () => {
  const { data: session, status } = useSession()
  const [mentions, setMentions] = useState<Mention[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string[]>([])

  const handleFetch = async () => {
    if (!session?.sub) {
      // console.log('No user sub found in session:', session)
      return
    }

    setIsLoading(true)
    setError([])

    try {
      // console.log('Fetching mentions for user:', session.sub)
      const res = await apiClient.get(`/mentions/${session.sub}`)
      // console.log('API response:', res.data)

      if (!res.data.mentions) {
        throw new Error('No mentions data received')
      }

      const validMentions = res.data.mentions.filter(
        (mention: Mention) => mention && (mention.post || mention.comment || mention.commentReply)
      )
      // console.log('Valid mentions:', validMentions)
      setMentions(validMentions)
    } catch (err) {
      console.error('Error fetching mentions:', err)
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || err.message
        console.error('API error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        })
        setError([`Failed to load mentions: ${message}`])
      } else {
        setError(['An unexpected error occurred while loading mentions'])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.sub) {
      // console.log('Session authenticated, user sub:', session.sub)
      handleFetch()
    } else {
      // console.log('Session status:', status, 'Session:', session)
    }
  }, [status, session?.sub])

  const getPostFromMention = (mention: Mention) => {
    if (mention.post) {
      return mention.post
    }

    if (mention.comment) {
      return {
        ...mention.comment.post,
        mentionContext: {
          type: 'comment',
          message: mention.comment.message,
          user: mention.comment.user
        }
      }
    }

    if (mention.commentReply) {
      // Include both the comment reply and the parent comment information
      // First, ensure we have all the required data
      if (!mention.commentReply.comment) {
        console.error('Invalid comment reply structure - missing comment:', mention.commentReply);
        return null;
      }

      const comment = mention.commentReply.comment;

      // Check if post exists in the comment
      if (!comment.post) {
        console.error('Invalid comment reply structure - missing post:', comment);
        return null;
      }

      // Safely access nested properties
      const commentId = comment.id;
      const commentMessage = comment.message;
      const commentUser = comment.user;

      if (!commentId || !commentUser) {
        console.error('Missing required comment data:', comment);
        return null;
      }

      return {
        ...comment,
        mentionContext: {
          type: 'reply',
          message: mention.commentReply.message,
          user: mention.commentReply.user,
          commentId: commentId, // Add the comment ID to properly link to the comment
          parentComment: {
            id: commentId,
            // The API now includes the message property, but we still need to handle cases where it might be undefined
            message: commentMessage ?? 'Original comment',
            user: commentUser
          }
        }
      }
    }

    return null
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12 bg-base-200 rounded-lg'>
          <h2 className='text-lg font-medium'>Please sign in to view mentions</h2>
          <p className='text-base-content/70 mt-2'>
            You need to be signed in to see who has mentioned you
          </p>
        </div>
      </div>
    )
  }

  if (error.length > 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <ErrorMessage error={error} />
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-2'>Mentions</h1>
        <p className='text-base-content/70'>
          Posts, comments, and replies where you've been mentioned
        </p>
      </div>

      <div className='space-y-6'>
        {mentions.length === 0 ? (
          <div className='text-center py-12 bg-base-200 rounded-lg'>
            <h2 className='text-lg font-medium'>No mentions yet</h2>
            <p className='text-base-content/70 mt-2'>
              When someone mentions you in a post, comment, or reply, you'll see it here
            </p>
          </div>
        ) : (
          mentions.map(mention => {
            const post = getPostFromMention(mention)
            return post ? (
              <div key={mention.id} className='bg-base-200 rounded-lg p-4'>
                <DynamicPost post={post} handleFetch={handleFetch} />
              </div>
            ) : null
          })
        )}
      </div>
    </div>
  )
}

export default MentionsPage