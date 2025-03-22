'use client'

import React, { useState } from 'react'
import Timeline from './timeline'
import CreatePost from './createPost'

export default function DashboardPage() {
  const [key, setKey] = useState(0)

  const handlePost = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      <div className='space-y-6'>
        <div className='bg-base-200 rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-4'>Create Post</h2>
          <CreatePost handlePost={handlePost} />
        </div>

        <div className='bg-base-200 rounded-lg p-4'>
          <Timeline key={key} />
        </div>
      </div>
    </div>
  )
}
