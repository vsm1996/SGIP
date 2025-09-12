"use client"
import { signIn } from "next-auth/react"
import Link from "next/link"

export function SignIn() {
  return (<Link tabIndex={-1} className='mr-3 link link-hover' href='/api/auth/signin'>
    Sign In
  </Link>)
}