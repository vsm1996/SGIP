'use client'

import React, { FormEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { CanceledError } from 'axios';

import apiClient from '@/app/services/api-client';
import ErrorMessage from '../errorMessage';

const RegisterForm = () => {
  const [error, setErrorMessage] = useState<string[] | null>(null)

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    apiClient
      .post('/register', {
        email: emailRef.current!.value,
        password: passwordRef.current!.value,
        firstName: firstNameRef.current!.value,
        lastName: lastNameRef.current!.value,
        username: usernameRef.current!.value,
      })
      .then(res => {
        // console.log('res', res.data)
        setErrorMessage(null)
        router.push('/api/auth/signin')
      })
      .catch(err => {
        if (err instanceof CanceledError) return
        console.log(err.response.data)
        setErrorMessage(err.response?.data || ['An error occurred while posting.'])
      })
  }

  return (
    <div className='w-full flex align-center justify-center xl:w-1/2'>
      {error && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-sm md:w-lg bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Register</legend>

          <label htmlFor='firstName' className='input input-bordered flex items-center gap-2 w-full'>
            <input ref={firstNameRef} id='firstName' type='text' placeholder='First Name' className='grow bg-transparent' required />
          </label>

          <label htmlFor='lastName' className='input input-bordered flex items-center gap-2 w-full'>
            <input ref={lastNameRef} id='lastName' type='text' placeholder='Last Name' className='grow bg-transparent' required />
          </label>

          <label htmlFor='username' className='input input-bordered flex items-center gap-2 w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input ref={usernameRef} id='username' type='text' placeholder='Username' className='grow bg-transparent' required />
          </label>

          <label htmlFor='email' className='input input-bordered flex items-center gap-2 w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
            <input ref={emailRef} id='email' type='email' placeholder='Email' className='grow bg-transparent' required />
          </label>

          <label htmlFor='password' className='input input-bordered flex items-center gap-2 w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input ref={passwordRef} id='password' type='password' placeholder='Password' className='grow bg-transparent' required />
          </label>

          <button type='submit' className='btn btn-outline mt-5'>Submit</button>
        </fieldset>
      </form>
    </div>
  )
}

export default RegisterForm
