'use client';

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AxiosResponse, CanceledError } from 'axios'
import apiClient from '@/app/services/api-client'

import Post from '@/app/components/post'
import Comment from '@/app/components/comment'
import CreateReply from './createReply';
import Loading from '@/app/components/loading';
import Reply from '@/app/components/reply';
import Link from 'next/link';

const CommentStatusPage = () => {
  const [comment, setComment] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const url = usePathname();

  const regex = /\/status\/([^/]+)\/reply\/([^/]+)/;

  const match = url.match(regex);

  const postId = match![1]; // First capture group
  const commentId = match![2];   // Second capture group

  const handleFetch = async () => {
    setLoading(true)
    apiClient
      .get(`/comment/${commentId}`)
      .then((res: AxiosResponse) => {
        setComment(res.data)
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
    <div className='flex flex-col items-center justify-center px-0 py-36 w-full'>
      {errorMessage && <p>{errorMessage}</p>}
      {isLoading && <Loading />}
      <div className='w-full p-6 md:p-0 md:w-1/2'>
        <Link href={`/status/${postId}`}>
          <span className='w-fit flex items-center gap-2 mb-5 hover:border-b-2 transition-all duration-100 ease-in-out'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
            <small>
              Back to comment
            </small>
          </span>
        </Link>
        {comment && <Comment type='post' comment={comment} postId={comment.postId} handleFetch={handleFetch} />}
        {comment && <CreateReply handleReply={handleFetch} postId={postId} commentId={comment.id} />}
        {comment?.commentReplies?.length > 0 &&
          <div className='border border-base-300 rounded-lg p-4 md:p-5'>
            {comment.commentReplies.map((reply: any) => (
              <span key={reply.id}>
                <Reply key={reply.id} commentId={comment.id} reply={reply} handleFetch={handleFetch} />
                {comment.commentReplies.length > 1 && <div className="divider my-5"></div>}
              </span>
            ))}
          </div>
        }
      </div>

    </div>
  )
}

export default CommentStatusPage