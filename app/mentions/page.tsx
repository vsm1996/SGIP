'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Mention } from '@prisma/client'
import apiClient from '@/app/services/api-client'
import { AxiosResponse } from 'axios'
import Post from '../components/post'

const MentionsPage = () => {
  const { data: session } = useSession()
  const [mentions, setMentions] = useState<Mention[] | []>([])

  // call mentions based on userID returned from session in API
  const handleFetch = async () => {
    apiClient
      .get(`/mentions/${session!.sub}`)
      .then((res: AxiosResponse) => {
        setMentions(res.data)
      })
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <div>
      {mentions.length === 0 && (<h2>No mentions found</h2>)}
      {mentions.length > 0 && mentions.map(mention => (
        <Post
          handleFetch={handleFetch}
          post={mention}
        />
      ))}
    </div>
  )
}

export default MentionsPage
