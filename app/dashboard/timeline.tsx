'use client';

import React, { useEffect, useState } from 'react'
import apiClient from '@/app/services/api-client';
import { revalidatePath } from "next/cache"
import { AxiosResponse, AxiosError, CanceledError } from 'axios';
import Post from '../components/post';
import CreatePost from './createPost';
import Link from 'next/link';

const Timeline = () => {
  const [posts, setPosts] = useState<any>([])
  const [error, setErrorMessage] = useState<any>()


  const handleFetch = async () => {
    apiClient
      .get('/post')
      .then((res: AxiosResponse) => {
        const newData = res.data.reverse()
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
      <ul className='flex flex-col'>
        {!posts && <div className='loading loading-ring loading-lg py-20' />}
        {posts && posts.map((post: any) => (
          <Link href={`/status/${post.id}`} className='z-0' key={post.id}>
            <Post post={post} />
          </Link>
        )
        )}
      </ul>
    </div>
  )
}

export default Timeline