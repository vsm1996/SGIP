'use client'

import { useState } from 'react'
import apiClient from '@/services/api-client'
import ErrorMessage from '../errorMessage'
import dynamic from 'next/dynamic'

const DynamicEditor = dynamic(() => import('./rich-text-editor'), { ssr: false })

interface EditPostProps {
  postId: string
  initialMessage: string
  initialContent: string
  initialIsRichText: boolean
  onClose: () => void
  onSave: () => void
}

const EditPost = ({
  postId,
  initialMessage,
  initialContent,
  initialIsRichText,
  onClose,
  onSave
}: EditPostProps) => {
  const [message, setMessage] = useState<string>(initialMessage)
  const [content, setContent] = useState<string>(initialContent)
  const [useRichText, setUseRichText] = useState<boolean>(initialIsRichText)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    apiClient
      .patch(`/post/${postId}`, {
        message,
        content: content || "",
        isRichText: useRichText
      })
      .then(() => {
        setIsLoading(false)
        onSave()
        onClose()
      })
      .catch(err => {
        setIsLoading(false)
        setErrorMessage(err.response?.data || ['An error occurred while updating the post.'])
      })
  }

  const handleRichTextChange = (text: string, html: string) => {
    setMessage(text)
    setContent(html)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-200 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
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
              placeholder="Edit your post"
              initialContent={initialMessage}
            />
          ) : (
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Edit your post"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost