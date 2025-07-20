'use client';

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AxiosResponse, CanceledError } from 'axios'
import apiClient from '@/services/api-client'

import Post from '@/components/post'
import Comment from '@/components/comment'
import CreateComment from './createComment'
import Loading from '@/components/loading';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicPost = dynamic(() => import('@/components/post'), { ssr: false })

const PostStatusPage = () => {
  const [post, setPost] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const pathname = usePathname().split('/').pop();

  const handleFetch = async () => {
    setLoading(true)
    apiClient
      .get(`/post/${pathname}`)
      .then((res: AxiosResponse) => {
        setPost(res.data)
      })
      .catch((err) => {
        if (err instanceof CanceledError) return
        console.error(err)
        setErrorMessage(err.response?.data.error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <div className='flex flex-col items-center justify-center px-0 py-6 md:py-10 w-full'>
      {errorMessage && <p>{errorMessage}</p>}
      {isLoading && <Loading />}
      <div className='w-full p-6 md:p-0 md:w-1/2'>
        <Link href={`/dashboard`}>
          <span className='w-fit flex items-center gap-2 mb-5 hover:border-b-2 transition-all duration-100 ease-in-out'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
            <small>
              Back to dashboard
            </small>
          </span>
        </Link>
        {post && <DynamicPost post={post} handleFetch={handleFetch} />}
        {post && <CreateComment handleComment={handleFetch} postId={post.id} />}
        {post?.comments.length > 0 &&
          <div className='border border-base-300 rounded-lg p-4 md:p-5'>
            {post.comments.map((comment: any) => (
              <span key={comment.id}>
                <Comment key={comment.id} postId={post.id} comment={comment} handleFetch={handleFetch} />
                {post.comments.length > 1 && <div className="divider my-5"></div>}
              </span>
            ))}
          </div>
        }
      </div>

    </div>
  )
}

export default PostStatusPage