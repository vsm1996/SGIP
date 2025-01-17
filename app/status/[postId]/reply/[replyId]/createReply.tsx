'use client';

import apiClient from '@/app/services/api-client'
import { useSession } from 'next-auth/react'
import React, { FormEvent, useRef, useState } from 'react'
import { CanceledError } from 'axios'
import ErrorMessage from '@/app/components/errorMessage';

const CreateReply = ({ handleReply, postId, commentId }: any) => {
  const [error, setErrorMessage] = useState<string[] | null>(null)
  const { data: session }: any = useSession()
  const messageRef = useRef<HTMLTextAreaElement>(null)

  // create comment -> POST - /api/post/:userId/comment/:postId
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const message = messageRef.current?.value;

    if (!message) return;

    setErrorMessage(null)
    apiClient
      .post(`/post/${session.sub}/comment/${postId}/reply/${commentId}`, { message })
      .then(res => {
        messageRef.current!.value = ""
        handleReply()
      })
      .catch(err => {
        if (err instanceof CanceledError) return
        // setErrorMessage(err.response?.data || ['An unknown error occurred.'])
        setErrorMessage(err.response?.data || ['An error occurred while commenting.'])
      })

  }

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <form onSubmit={handleSubmit} className='flex flex-col items-end w-full mb-5 mt-1'>
        <textarea
          ref={messageRef}
          placeholder="Anything to share?"
          className='w-full textarea textarea-bordered textarea-md mb-3'
        />
        <button type='submit' className='btn btn-outline'> Reply </button>
      </form>
    </>
  )
}

export default CreateReply
