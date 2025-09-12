import apiClient from '@/services/api-client'
import { CommentReply } from '@prisma/client'
import { CanceledError } from 'axios'
import React, { Dispatch, MouseEvent, SetStateAction } from 'react'

interface ReplyLikeButtonProps {
  session: any,
  reply: any,
  commentId: string,
  liked: boolean,
  setLiked: Dispatch<SetStateAction<boolean>>,
  handleFetch: () => void,
}

const ReplyLikeButton = ({ session, reply, commentId, liked, setLiked, handleFetch, }: ReplyLikeButtonProps) => {

  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    liked ? (
      apiClient
        .post(`/reply/${reply.id}/unliked`, {
          userId: session.sub
        })
        .then(res => {
          setLiked(false)
          handleFetch()
        })
        .catch(err => {
          if (err instanceof CanceledError) return
        })) : (
      apiClient
        .post(`/reply/${reply.id}/liked`, {
          userId: session.sub
        })
        .then(res => {
          setLiked(true)
          handleFetch()
        })
        .catch(err => {
          if (err instanceof CanceledError) return
        }))
  }

  return (
    <button onClick={handleLike}>
      <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 hover:fill-accent ${liked ? 'fill-accent stroke-accent' : 'fill-none stroke-current'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </button>
  )
}

export default ReplyLikeButton
