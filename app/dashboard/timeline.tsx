'use client';

import React, { Suspense, useEffect, useState } from 'react'
import apiClient from '@/app/services/api-client';
import { AxiosResponse, CanceledError } from 'axios';
import Post from '../components/post';
import CreatePost from './createPost';
import PostSkeleton from '@/app/components/post/postSkeleton'

const Timeline = () => {
  const [posts, setPosts] = useState<any>([])
  const [error, setErrorMessage] = useState<any>()


  const handleFetch = () => {
    apiClient
      .get('/post')
      .then(async (res: AxiosResponse) => {
        const newData = await res.data.reverse()
        setPosts(newData)

      })
      .catch((err) => {
        if (err instanceof CanceledError) return
        console.log(err.response)
        setErrorMessage(err.response?.data.error)
      })
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <div className='w-full lg:w-1/2'>
      <CreatePost handlePost={handleFetch} />
      {error && <p>{error}</p>}
      {posts.length === 0 && (
        <div className='flex items-center justify-center'>
          <div className="loading loading-ring loading-lg" />
        </div>
      )}
      <ul className='flex flex-col'>
        <Suspense fallback={<PostSkeleton />}>
          {posts.map((post: any) => (
            <Post key={post.id} post={post} handleFetch={handleFetch} />
          )
          )}
        </Suspense>
      </ul>
    </div>
  )
}

export default Timeline