'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Like } from '@prisma/client'
import Link from 'next/link'

import PostLikeButton from '@/app/components/button/post-like'
import PostDeleteButton from '@/app/components/button/post-delete'
import PostReactionButton from '@/app/components/button/post-reaction'
import PostBookmarkButton from '@/app/components/button/post-bookmark'
import PostShareButton from '@/app/components/button/post-share'
import EditPost from './editPost'

import { timeAgo } from '@/app/utils'
import { nunito, raleway } from '@/app/utils/font'
import { usePathname } from 'next/navigation'

interface PostProps {
  post: any,
  handleFetch: () => void,
}

const Post = ({ post, handleFetch }: PostProps) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState<boolean>(false)
  const [showRichContent, setShowRichContent] = useState<boolean>(false)
  const [postUrl, setPostUrl] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const pathname = usePathname()


  useEffect(() => {
    if (session && post.likes) {
      let userLiked = session && post.likes?.some((like: Like) => like!.userId === session!.sub)
      if (userLiked) setLiked(true)
    }

    // Set the post URL only after component is mounted (client-side)
    if (typeof window !== 'undefined') {
      if (process.env.NODE_ENV === 'production') {
        setPostUrl(`https://sgip-dev.vercel.app/status/${post.id}`)
      } else {
        setPostUrl(`${window.location.origin}/status/${post.id}`)
      }
    }
  }, [session, post.likes, post.id])

  return (
    <div className='card bg-base-200/95 backdrop-blur-sm shadow-xl mb-5 hover:bg-base-200/75 transition-all duration-200 ease-in-out text-base-content border border-base-300'>
      <div className='card-body'>
        {post.mentionContext && (
          <div className='bg-base-300/90 p-3 rounded-lg mb-4 border border-base-300/50'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='badge badge-sm'>{post.mentionContext.type}</span>
              <p className='text-sm opacity-70'>Mentioned by {post.mentionContext.user.username || post.mentionContext.user.name}</p>
            </div>
            <p className={`text-sm ${nunito.className}`}>{post.mentionContext.message}</p>
          </div>
        )}

        <Link href={`/status/${post.id}`} className='mb-4'>
          <div className='mb-3'>
            <div className='mb-4 flex items-center gap-1'>
              <p className={`justify-self-start font-semibold ${raleway.className}`}> {post.user.username || post.user.name} </p>
              <small className='text-xs opacity-45'> {timeAgo(post.createdAt)} </small>
            </div>
            <p className={`font-extralight ${nunito.className} text-lg`}> {post.message} </p>
            {post.isRichText && post.content && (
              <div className="mt-2">
                {showRichContent ? (
                  <div className="rich-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <button
                    onClick={() => setShowRichContent(true)}
                    className="text-xs text-accent hover:underline"
                  >
                    Show more content
                  </button>
                )}
              </div>
            )}
          </div>
        </Link>

        <div className='flex justify-between items-center mt-3'>
          {/* Left side - Reactions */}
          <div className='flex items-center gap-3'>
            <PostReactionButton session={session} postId={post.id} handleFetch={handleFetch} />

            <div className='flex items-center gap-1'>
              <Link href={`/status/${post.id}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-current">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
              </Link>
              <span>{post?.comments?.length || 0}</span>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className='flex items-center gap-3'>
            {session && <PostBookmarkButton session={session} postId={post.id} />}
            {/* Only render PostShareButton on client-side when postUrl is available */}
            {typeof window !== 'undefined' && <PostShareButton postId={post.id} postUrl={postUrl || `${window.location.origin}/status/${post.id}`} />}
            {session && post.userId === session!.sub && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-sm"
                  aria-label="Edit post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>

                </button>
                <PostDeleteButton postId={post.id} handleFetch={handleFetch} />
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <EditPost
          postId={post.id}
          initialMessage={post.message}
          initialContent={post.content || ""}
          initialIsRichText={post.isRichText || false}
          onClose={() => setIsEditing(false)}
          onSave={handleFetch}
        />
      )}
    </div>
  )
}

export default Post
