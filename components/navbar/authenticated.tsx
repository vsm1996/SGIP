'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Authenticated = () => {
  const { status, data: session } = useSession()

  return status === 'authenticated' && (
    <li className='flex justify-between items-center sm:w-full space-x-3'>
      <span className='text-lg font-extrabold max-sm:hidden'>Welcome, {session.user!.firstName || session.user!.name}</span>
      <span className='flex items-center'>
        <Link tabIndex={-1} href='/dashboard' className='link link-hover mr-5'>Dashboard</Link>
        <Link tabIndex={-1} href='/api/auth/signout' className='link link-hover text-nowrap'>Sign Out</Link>
      </span>
    </li>
  )
}

export default Authenticated
