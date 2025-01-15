import React from 'react'

const ErrorMessage = ({ error }: { error: [] }) => {
  return (
    <div className='mb-4 w-full flex justify-center'>
      {error.map((message, index) => (
        <p key={index}> {message}</p>
      ))}
    </div>
  )
}

export default ErrorMessage
