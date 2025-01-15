import apiClient from '@/app/services/api-client'
import { useSession } from 'next-auth/react'
import React, { FormEvent, useRef, useState } from 'react'
import { CanceledError } from 'axios'

const CreatePost = ({ handlePost }: any) => {
  const [error, setErrorMessage] = useState<[] | null>(null)
  const { data: session }: any = useSession()
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (messageRef.current) {
      setErrorMessage(null)
      apiClient
        .post(`/post/${session.sub}`, { message: messageRef.current.value })
        .then(res => {
          console.log('res????', res)
          messageRef.current!.value = ""
          handlePost()
        })
        .catch(err => {
          if (err instanceof CanceledError) return
          setErrorMessage(err.response.data)
        })
    }
  }

  return (
    <>
      {error && (
        <div className='mb-4 w-full flex justify-center'>
          {error.map((message, index) => <p key={index}> {message}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit} className='flex flex-col items-end w-full mb-5'>
        <textarea
          id='createPostField'
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
