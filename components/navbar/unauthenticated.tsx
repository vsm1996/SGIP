'use client'
import { useSession } from 'next-auth/react'
import { SignIn } from '../auth/signin-button'
import Link from 'next/link'
import React from 'react'

const Unauthenticated = () => {
  const { status } = useSession()

  return status === 'unauthenticated' && (<li>
    <Link tabIndex={-1} className='mr-3 link link-hover' href='/api/auth/signin'>
      <SignIn />
    </Link>
  </li>
  )
}

export default Unauthenticated
