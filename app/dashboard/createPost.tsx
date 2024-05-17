import apiClient from '@/app/services/api-client'
import { useSession } from 'next-auth/react'
import React, { FormEvent, useRef, useState } from 'react'
import { CanceledError } from 'axios'

const CreatePost = ({ handlePost }: any) => {
  const [error, setErrorMessage] = useState(null)
  const { data: session }: any = useSession()
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (messageRef.current) {
      apiClient
        .post(`/post/${session.sub}`, { message: messageRef.current.value })
        .then(res => {
          setErrorMessage(null)
          messageRef.current!.value = ""
          handlePost()
        })
        .catch(err => {
          if (err instanceof CanceledError) return
          setErrorMessage(err.response.data.error)
        })
    }
  }

  return (
    <>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col items-end w-full mb-5'>
        <textarea
          ref={messageRef}
          placeholder="Anything to share?"
          className='w-full textarea textarea-bordered textarea-md mb-3'
        />
        <button type='submit' className='btn btn-outline'> Post </button>
      </form>
    </>
  )
}

export default CreatePost
