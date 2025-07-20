'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { timeAgo } from '@/utils'
import { nunito, raleway } from '@/utils/font'
import ForumComment from '../comment/forum-comment'
import ForumCommentForm from '../comment/forum-comment-form'
import ForumPostDeleteButton from '../button/forum-post-delete'

interface ForumPostProps {
  post: {
    id: string
    message: string
    content: string
    createdAt: string
    userId: string
    user: {
      id: string
      username?: string
      name?: string
    }
    _count?: {
      comments: number
      likes: number
    }
  }
  forumSlug: string
  showComments?: boolean
  onDelete?: () => void
}

const ForumPost = ({ post, forumSlug, showComments = false, onDelete }: ForumPostProps) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(post._count?.likes || 0)
  const [comments, setComments] = useState<any[]>([])
  const [showCommentsSection, setShowCommentsSection] = useState<boolean>(showComments)
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has liked this post
    const checkLikeStatus = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/forums/${forumSlug}/posts/${post.id}/liked`, {
          method: 'GET'
        })

        if (response.ok) {
          const data = await response.json()
          setLiked(data.liked)
        }
      } catch (err) {
        console.error('Error checking like status:', err)
      }
    }

    checkLikeStatus()

    // Load comments if showComments is true
    if (showCommentsSection) {
      fetchComments()
    }
  }, [session, post.id, forumSlug, showCommentsSection])

  const fetchComments = async () => {
    setIsLoadingComments(true)
    setError(null)

    try {
      const response = await fetch(`/api/forums/${forumSlug}/posts/${post.id}/comments`)

      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }

      const data = await response.json()
      setComments(data)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleLike = async () => {
    if (!session) return

    try {
      const endpoint = liked
        ? `/api/forums/${forumSlug}/posts/${post.id}/unliked`
        : `/api/forums/${forumSlug}/posts/${post.id}/liked`

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

  const handleCommentAdded = () => {
    fetchComments()
  }

  const handleDeleteComment = async (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId))
  }

  const toggleComments = () => {
    setShowCommentsSection(!showCommentsSection)
    if (!showCommentsSection && comments.length === 0) {
      fetchComments()
    }
  }

  return (
    <div className="card bg-base-200 shadow-md mb-6 overflow-hidden">
      <div className="card-body">
        <div className="mb-2 flex justify-between items-start">
          <div>
            <h3 className={`card-title ${raleway.className}`}>{post.message}</h3>
            <p className="text-sm opacity-70">
              Posted by {post.user.username || post.user.name} • {timeAgo(post.createdAt)}
            </p>
          </div>

          {!showComments && (
            <Link
              href={`/forums/${forumSlug}/posts/${post.id}`}
              className="btn btn-ghost btn-sm"
            >
              View Post
            </Link>
          )}
        </div>

        <div className={`${nunito.className} whitespace-pre-wrap mb-4`}>
          {post.content}
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1"
            disabled={!session}
          >
            {liked ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
            )}
            <span>{likeCount}</span>
          </button>

          <button
            onClick={toggleComments}
            className="flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            <span>{post._count?.comments || 0}</span>
          </button>

          {session?.sub === post.userId && (
            <ForumPostDeleteButton
              forumSlug={forumSlug}
              postId={post.id}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>

      {showCommentsSection && (
        <div className="px-8 pb-6">
          <div className="divider my-2">Comments</div>

          <ForumCommentForm
            forumSlug={forumSlug}
            postId={post.id}
            onCommentAdded={handleCommentAdded}
          />

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {isLoadingComments ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-base-content/70">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <ForumComment
                  key={comment.id}
                  comment={comment}
                  forumSlug={forumSlug}
                  postId={post.id}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ForumPost