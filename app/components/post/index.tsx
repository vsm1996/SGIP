'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Like } from '@prisma/client'
import LikeButton from '@/app/api/post/[id]/comments/button/like'
import Link from 'next/link'

const Post = ({ post, handleFetch }: any) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState<boolean>(false)

  useEffect(() => {
    let userLiked = session && post.likes?.find((like: Like) => like!.userId === session!.sub)

    if (userLiked) setLiked(true)
  }, [])

  return (
    <div className='card bg-neutral shadow-xl mb-5'>
      <div className='card-body'>
        <Link href={`/status/${post.id}`} className='mb-4'>
          <div className='mb-3'>
            <p className='text-left mb-4'> {post.user.name || post.user.username} </p>
            <p> {post.message} </p>
          </div>
        </Link>
        <div className='flex justify-end gap-5'>
          <div className='flex items-center gap-1 z-10'>
            <LikeButton post={post} liked={liked} setLiked={setLiked} handleFetch={handleFetch} />
            <p> {post.likes?.length || 0} </p>
          </div>
          <div className='flex items-center gap-1 z-10'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            {post?.comments?.length || 0}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
