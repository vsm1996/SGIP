import apiClient from '@/app/services/api-client'
import { useSession } from 'next-auth/react'
import React, { FormEvent, useRef, useState } from 'react'
import { CanceledError } from 'axios'
import ErrorMessage from '../components/errorMessage';

interface CreatePostProps {
  handlePost: () => void;
}

const CreatePost = ({ handlePost }: CreatePostProps) => {
  const [error, setErrorMessage] = useState<string[] | null>(null)
  const { data: session }: any = useSession()
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const message = messageRef.current?.value;

    if (!message) return;

    setErrorMessage(null)
    apiClient
      .post(`/post`, { message, userId: session.sub })
      .then(res => {
        messageRef.current!.value = ""
        // refetch data
        handlePost()
      })
      .catch(err => {
        if (err instanceof CanceledError) return
        // setErrorMessage(err.response?.data || ['An unknown error occurred.'])
        setErrorMessage(err.response?.data || ['An error occurred while posting.'])
      })

  }

  return (
    <>
      {error && <ErrorMessage error={error} />}
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
