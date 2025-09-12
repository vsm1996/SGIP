import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'

const Input = ({ label }: {
  label: string
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current!.value = e.currentTarget.value
    }
  }

  return (
    <>
      <label htmlFor=''>{label}</label>
      <input ref={inputRef} id='' onChange={handleChange} placeholder={label} />
    </>
  )
}

export default Input
