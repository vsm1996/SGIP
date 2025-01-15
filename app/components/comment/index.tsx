'use client'

import React, { MouseEvent, useEffect, useState } from 'react'
import apiClient from '@/app/services/api-client'
import { CanceledError } from 'axios'
import { useSession } from 'next-auth/react'
import { Like } from '@prisma/client'
import CommentLikeButton from '@/app/components/button/comment-like'
import PostDeleteButton from '@/app/components/button/post-delete'
import CommentDeleteButton from '@/app/components/button/comment-delete'
import { timeAgo } from '@/app/utlis'

interface User {
  name: string,
}

interface CommentProps {
  comment: any,
  postId: string,
  handleFetch: () => void,
}

const Comment = ({ comment, postId, handleFetch }: CommentProps) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState<boolean>(false)

  useEffect(() => {
    if (session && comment.likes) {
      let userLiked = comment.likes?.some((like: Like) => like!.userId === session.sub)
      if (userLiked) setLiked(true)
    }
  }, [comment.likes, session])

  return (
    <div className='card bg-neutral hover:bg-[#281b61] transition-all duration-200 shadow-xl ease-in-out'>
      <div className='card-body'>
        <div className='mb-4 flex items-center gap-1'>
          <p className='justify-self-start'> {comment.user.name || comment.user.username} </p>
          <small className='text-xs opacity-45'> {timeAgo(comment.createdAt)} </small>
        </div>
        <p> {comment.message} </p>
        <div className='flex justify-end gap-5'>
          <div className='flex items-center gap-1'>
            <CommentLikeButton session={session} comment={comment} postId={postId} liked={liked} setLiked={setLiked} handleFetch={handleFetch} />
            <p> {comment.likes?.length || 0} </p>
          </div>
          {/* <div className='flex items-center gap-1 z-1'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            {comment?.commentReplies?.length || 0}
          </div> */}
          {session && comment.userId === session!.sub && (<div className='flex items-center'>
            <CommentDeleteButton comment={comment} handleFetch={handleFetch} />
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default Comment
