'use client';

import React, { Suspense, useEffect, useState } from 'react'
import apiClient from '@/app/services/api-client';
import { AxiosResponse, CanceledError } from 'axios';
import CreatePost from './createPost';
import PostSkeleton from '@/app/components/post/postSkeleton'
import ErrorMessage from '../components/errorMessage';
import Loading from '../components/loading';
import dynamic from 'next/dynamic';

const DynamicPost = dynamic(() => import('../components/post'), { ssr: false })



const Timeline = () => {
  const [posts, setPosts] = useState<any>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setErrorMessage] = useState<[]>()


  const handleFetch = () => {
    setLoading(true)
    apiClient
      .get('/post')
      .then(async (res: AxiosResponse) => {
        const newData = await res.data.reverse()
        setPosts(newData)
      })
      .catch((err) => {
        if (err instanceof CanceledError) return
        console.log(err.response)
        setErrorMessage(err.response?.data)
      }).finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <div className='w-full lg:w-1/2 flex-1'>
      {error && <ErrorMessage error={error} />}
      <CreatePost handlePost={handleFetch} />
      {isLoading && <Loading />}
      <ul className='flex flex-col'>
        <Suspense fallback={<PostSkeleton />}>
          {posts.map((post: any) => (
            <DynamicPost key={post.id} post={post} handleFetch={handleFetch} />
          )
          )}
        </Suspense>
      </ul>
    </div>
  )
}

export default Timeline