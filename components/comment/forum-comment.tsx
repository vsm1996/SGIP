'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { timeAgo } from '@/utils'
import { nunito, raleway } from '@/utils/font'

interface CommentProps {
  comment: {
    id: string
    message: string
    createdAt: string
    user: {
      username?: string
      name?: string
      image?: string
      id: string
    }
    _count?: {
      likes: number
      commentReplies: number
    }
    likes: Array<{ userId: string }>
  }
  forumSlug: string
  postId: string
  onDelete?: (commentId: string) => void
}

const ForumComment = ({ comment, forumSlug, postId, onDelete }: CommentProps) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState<boolean>(
    Boolean(session && comment.likes?.some(like => like.userId === session?.sub))
  )
  const [likeCount, setLikeCount] = useState<number>(comment._count?.likes || 0)

  const handleLike = async () => {
    if (!session) return

    try {
      const endpoint = liked
        ? `/api/forums/${forumSlug}/posts/${postId}/comments/${comment.id}/unliked`
        : `/api/forums/${forumSlug}/posts/${postId}/comments/${comment.id}/liked`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setLiked(!liked)
        setLikeCount(prev => liked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDelete = async () => {
    if (!session || !onDelete) return

    try {
      const response = await fetch(`/api/forums/${forumSlug}/posts/${postId}/comments/${comment.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete(comment.id)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="p-4 bg-base-300/50 rounded-lg mb-2 border border-base-300/30">
      <div className="flex items-center gap-2 mb-2">
        {comment.user.image && (
          <img
            src={comment.user.image}
            alt={comment.user.username || comment.user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div>
          <p className={`font-medium ${raleway.className}`}>
            {comment.user.username || comment.user.name || 'User'}
          </p>
          <p className="text-xs opacity-70">{timeAgo(comment.createdAt)}</p>
        </div>
      </div>

      <p className={`${nunito.className} mb-3 whitespace-pre-wrap`}>{comment.message}</p>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm"
            disabled={!session}
          >
            {liked ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
            )}
            <span>{likeCount}</span>
          </button>
        </div>

        {session?.sub === comment.user.id && (
          <button
            onClick={handleDelete}
            className="text-sm text-error flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default ForumComment