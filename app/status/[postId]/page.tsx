'use client';

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AxiosResponse, CanceledError } from 'axios'
import apiClient from '@/app/services/api-client'

import Post from '@/app/components/post'
import Comment from '@/app/components/comment'
import CreateComment from './createComment'

const PostStatusPage = () => {
  const [post, setPost] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState(null)


  const pathname = usePathname().split('/').slice(2)[0];

  const handleFetch = async () => {
    apiClient
      .get(`/post/${pathname}`)
      .then((res: AxiosResponse) => {
        setPost(res.data)
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
    <div className='flex flex-col items-center justify-center px-0 py-36 w-full'>
      {errorMessage && <p>{errorMessage}</p>}
      {!post && (
        <div className="loading loading-ring loading-lg py-20"></div>
      )}
      <div className='w-1/2'>
        {post && <Post post={post} />}
        {post && <CreateComment handleComment={handleFetch} postId={post.id} />}
        {post?.comments.length > 0 &&
          <div className='border border-base-300 rounded-lg p-5'>
            {post.comments.map((comment: any) => (
              <span key={comment.id}>
                <Comment postId={post.id} comment={comment} />
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
