'use client';

import React, { Suspense, useEffect, useState } from 'react'
import apiClient from '@/app/services/api-client';
import { AxiosResponse, CanceledError } from 'axios';
import Post from '../components/post';
import CreatePost from './createPost';
import PostSkeleton from '@/app/components/post/postSkeleton'
import ErrorMessage from '../components/errorMessage';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface PostType {
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

const Timeline = () => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setErrorMessage] = useState<string[]>([])

  const handleFetch = () => {
    setLoading(true)
    setErrorMessage([])

    apiClient
      .get('/post')
      .then((res: AxiosResponse) => {
        // Validate the response data
        const data = res.data
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }

        setPosts(data.reverse())
      })
      .catch((err) => {
        if (err instanceof CanceledError) return
        console.error('Error fetching posts:', err)
        setErrorMessage([err.response?.data?.message || 'Failed to load posts'])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <div className='space-y-6'>
      {/* Posts Timeline */}
      <div className='bg-base-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='p-4 border-b border-base-300 flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>Recent Posts</h2>
          <button
            onClick={handleFetch}
            disabled={isLoading}
            className='btn btn-ghost btn-sm'
            aria-label='Refresh posts'
          >
            <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error.length > 0 && (
          <div className='p-4'>
            <ErrorMessage error={error} />
          </div>
        )}

        {isLoading ? (
          <div className='p-4 space-y-4'>
            {[...Array(3)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className='divide-y divide-base-300'>
            <Suspense fallback={<PostSkeleton />}>
              {posts.length === 0 ? (
                <div className='p-8 text-center text-base-content/70'>
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className='p-4'>
                    <Post post={post} handleFetch={handleFetch} />
                  </div>
                ))
              )}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}

export default Timeline