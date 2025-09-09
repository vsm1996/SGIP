'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import apiClient from '@/app/services/api-client'
import ErrorMessage from '@/app/components/errorMessage'

const SettingsPage = () => {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (session?.sub) {
      apiClient.get(`/users/${session.sub}`).then(response => {
        const { email, username, name } = response.data

        let firstName = response.data.firstName
        let lastName = response.data.lastName

        if (name.length > 2 && !firstName && !lastName) {
          const split = name.split(' ')
          firstName = split[0]
          lastName = split[1]
        }

        setFormData(prev => ({
          ...prev,
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          username: username || ''
        }))
      })
    }
  }, [session?.sub])

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.firstName.trim()) errors.push('First name is required')
    if (!formData.lastName.trim()) errors.push('Last name is required')
    if (!formData.email.trim()) errors.push('Email is required')
    if (!formData.username.trim()) errors.push('Username is required')

    // Only validate password fields if any of them are filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) errors.push('Current password is required to change password')
      if (!formData.newPassword) errors.push('New password is required')
      if (!formData.confirmPassword) errors.push('Please confirm your new password')
      if (formData.newPassword !== formData.confirmPassword) {
        errors.push('New passwords do not match')
      }
      if (formData.newPassword && formData.newPassword.length < 8) {
        errors.push('Password must be at least 8 characters long')
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address')
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(undefined)
    setSuccessMessage('')
    setIsLoading(true)

    const errors = validateForm()
    if (errors.length > 0) {
      setErrorMessage(errors)
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.put(`/users/${session?.sub}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        ...(formData.currentPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      setSuccessMessage('Profile updated successfully')
      // Update session with new user data
      await updateSession()

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error: any) {
      setErrorMessage(error.response?.data || ['An error occurred while updating your profile'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear messages when user starts typing
    setErrorMessage(undefined)
    setSuccessMessage('')
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please sign in to access settings</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && <ErrorMessage error={errorMessage} />}
        {successMessage && (
          <div className="alert alert-success">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="John"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="johndoe"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="john@example.com"
          />
        </div>

        <div className="divider">Change Password</div>

        <div className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Current Password</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your current password"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your new password"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Confirm your new password"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
