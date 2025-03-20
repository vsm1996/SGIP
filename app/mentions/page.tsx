'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Mention as MentionType, Post as PostType } from '@prisma/client'

type MentionWithPost = MentionType & {
  post: PostType & {
    user: {
      name: string
      username: string
    }
    comments: any[]
    likes: any[]
  }
}
import apiClient from '@/app/services/api-client'
import { AxiosResponse } from 'axios'
import Post from '../components/post'
import Loading from '../components/loading'

const MentionsPage = () => {
  const { data: session, status } = useSession()
  const [mentions, setMentions] = useState<MentionWithPost[] | []>([])
  const [isLoading, setIsLoading] = useState(true)

  // call mentions based on userID returned from session in API
  const handleFetch = async () => {
    if (!session?.sub) return
    setIsLoading(true)
    try {
      const res: AxiosResponse = await apiClient.get(`/mentions/${session.sub}`)
      setMentions(res.data)
    } catch (error) {
      console.error('Error fetching mentions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      handleFetch()
    }
  }, [status, session])

  if (status === 'loading' || isLoading) {
    return <Loading />
  }

  return (
    <div className='py-20 md:py-36'>
      {mentions.length === 0 && (<h2>No mentions found</h2>)}
      {mentions.length > 0 && mentions.map(mention => (
        <Post
          key={mention.id}
          handleFetch={handleFetch}
          post={mention.post}
        />
      ))}
    </div>
  )
}

export default MentionsPage
