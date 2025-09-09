'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import apiClient from '@/app/services/api-client'
import ErrorMessage from '@/app/components/errorMessage'
import RichTextEditor from '@/app/components/post/rich-text-editor'
import dynamic from 'next/dynamic'

interface CreatePostProps {
  handlePost: () => void;
}

const DynamicEditor = dynamic(() => import('@/app/components/post/rich-text-editor'), { ssr: false })

const CreatePost = ({ handlePost }: CreatePostProps) => {
  const { data: session } = useSession()
  const [message, setMessage] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [useRichText, setUseRichText] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session) return

    setIsLoading(true)

    apiClient
      .post(`/post`, {
        message,
        userId: session.sub,
        content: content || "",
        isRichText: useRichText
      })
      .then(res => {
        setMessage('')
        setContent('')
        setIsLoading(false)
        handlePost()
      })
      .catch(err => {
        setIsLoading(false)
        setErrorMessage(err.response?.data || ['An error occurred while posting.'])
      })
  }

  const handleRichTextChange = (text: string, html: string) => {
    setMessage(text)
    setContent(html)
  }

  return (
    <div className='card bg-base-200 shadow-xl mb-10 text-base-content'>
      <div className='card-body'>
        <form onSubmit={handleSubmit}>
          {errorMessage && <ErrorMessage error={errorMessage} />}

          <div className="mb-3 flex justify-end">
            <label className="cursor-pointer label gap-2">
              <span className="label-text">Use rich text editor</span>
              <input
                type="checkbox"
                className="toggle toggle-accent toggle-sm"
                checked={useRichText}
                onChange={() => setUseRichText(!useRichText)}
              />
            </label>
          </div>

          {useRichText ? (
            <DynamicEditor
              onChange={handleRichTextChange}
              placeholder="What's on your mind?"
            />
          ) : (
            <textarea
              className='textarea textarea-bordered w-full'
              placeholder="What's on your mind?"
              id='createPostField'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}

          <div className='card-actions justify-end mt-3'>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
