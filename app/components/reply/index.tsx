'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Like } from '@prisma/client'
import CommentLikeButton from '@/app/components/button/comment-like'
import CommentDeleteButton from '@/app/components/button/comment-delete'
import { timeAgo } from '@/app/utils'
import { nunito, raleway } from '@/app/utils/font'
import ReplyLikeButton from '../button/reply-like'
import ReplyDeleteButton from '../button/reply-delete'

interface User {
  name: string,
}

interface ReplyProps {
  reply: any,
  commentId: string,
  handleFetch: () => void,
}

const Reply = ({ reply, commentId, handleFetch }: ReplyProps) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState<boolean>(false)

  useEffect(() => {
    if (session && reply.likes) {
      let userLiked = reply.likes?.some((like: Like) => like!.userId === session.sub)
      if (userLiked) setLiked(true)
    }
  }, [reply.likes, session])

  return (
    <div className='card bg-base-200 hover:bg-base-200/75 transition-all duration-200 shadow-xl ease-in-out text-base-content'>
      <div className='card-body'>
        <div className='mb-4 flex items-center gap-1'>
          <p className={`justify-self-start font-semibold ${raleway.className}`}> {reply.user.name || reply.user.username} </p>
          <small className='text-xs opacity-45'> {timeAgo(reply.createdAt)} </small>
        </div>
        <p className={`font-extralight ${nunito.className}`}> {reply.message} </p>
        <div className='flex justify-end gap-5'>
          <div className='flex items-center gap-1'>
            <ReplyLikeButton session={session} reply={reply} commentId={commentId} liked={liked} setLiked={setLiked} handleFetch={handleFetch} />
            <p> {reply.likes?.length || 0} </p>
          </div>

          {session && reply.userId === session!.sub && <ReplyDeleteButton reply={reply} handleFetch={handleFetch} />}
        </div>
      </div>
    </div>
  )
}

export default Reply
