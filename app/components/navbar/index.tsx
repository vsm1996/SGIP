'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BellAlertIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import ThemeController from '../themeController'
import apiClient from '@/app/services/api-client'

interface Mention {
  id: string
  unread: boolean
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

const NavBar = () => {
  const { status, data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const displayName = session?.user?.username ||
    session?.user?.firstName ||
    session?.user?.name ||
    'User'

  useEffect(() => {
    const controller = new AbortController()

    const fetchUnreadMentions = async () => {
      if (session?.sub) {
        try {
          const response = await apiClient.get(`/mentions/${session.sub}`, {
            signal: controller.signal
          })
          const mentions = response.data?.mentions || []
          const unreadMentions = mentions.filter((mention: Mention) => mention.unread)
          setUnreadCount(unreadMentions.length)
        } catch (error) {
          // Ignore canceled requests
          if (!error || Object.keys(error).length === 0) {
            return;
          }
          console.error('Error fetching mentions:', error)
        }
      }
    }

    fetchUnreadMentions()
    const interval = setInterval(fetchUnreadMentions, 30000) // Poll every 30 seconds

    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [session])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = roomName.trim()

    if (!trimmedName) {
      setError('Room name cannot be empty')
      return
    }

    if (trimmedName.length < 3) {
      setError('Room name must be at least 3 characters long')
      return
    }

    if (trimmedName.length > 50) {
      setError('Room name must be less than 50 characters')
      return
    }

    try {
      // Save the room to the database
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: trimmedName }),
      })

      if (!response.ok) {
        throw new Error('Failed to create room')
      }

      const room = await response.json()
      setShowCreateRoom(false)
      setRoomName('')

      // Navigate to the room page
      router.push(`/rooms/${room.id}`)
    } catch (err) {
      console.error('Error creating room:', err)
      setError('Failed to create discussion room')
    }
  }

  return (
    <>
      <nav className='px-4 py-3 navbar bg-base-300 z-10 fixed top-0 left-0 right-0 shadow-md max-lg:text-sm'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center w-full'>
            {/* Left section */}
            <div className='flex items-center space-x-4'>
              <ThemeController />
              {status === 'authenticated' && (
                <div className='hidden md:flex items-center space-x-2'>
                  <UserCircleIcon className="w-5 h-5" />
                  <span className='font-medium'>{displayName}</span>
                </div>
              )}
            </div>

            {/* Center section - main navigation */}
            {status === 'authenticated' && (
              <div className='flex items-center space-x-6 '>
                <Link href='/dashboard' className='nav-link'>
                  Dashboard
                </Link>
                <Link href='/rooms' className='nav-link'>
                  Rooms
                </Link>
                <Link target="_blank" href='https://www.youtube.com/@george128306' className='nav-link max-lg:hidden inline-block'>
                  Video Lectures
                </Link>
                <Link target="_blank" href='https://www.youtube.com/@george128306' className='nav-link max-lg:inline-block hidden'>
                  Lectures
                </Link>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="btn btn-primary btn-sm normal-case flex items-center gap-2"
                  aria-label='create discussion room'
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Room</span>
                </button>
              </div>
            )}

            {/* Right section - user actions */}
            <div className='flex items-center space-x-4 '>
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/mentions"
                    className="btn btn-ghost btn-circle "
                    aria-label='notifications'
                  >
                    <div className='relative'>
                      <BellAlertIcon className='w-5 h-5' />
                      {unreadCount > 0 && (
                        <span className="badge badge-sm badge-primary badge-ping absolute -top-1 -right-1">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="divider divider-horizontal mx-0"></div>
                  <Link href='/api/auth/signout' className='btn btn-ghost btn-sm'>
                    Sign Out
                  </Link>
                </>
              ) : (
                <Link href='/api/auth/signin' className='btn btn-primary btn-sm'>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Create Discussion Room</h3>
            <form onSubmit={handleCreateRoom}>
              <div className="form-control">
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => {
                    setRoomName(e.target.value)
                    setError(null)
                  }}
                  placeholder="Enter room name"
                  className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                  maxLength={50}
                  autoFocus
                  required
                />
                {error && (
                  <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                  </label>
                )}
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowCreateRoom(false)
                    setRoomName('')
                    setError(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Room
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => {
            setShowCreateRoom(false)
            setRoomName('')
            setError(null)
          }}></div>
        </div>
      )}

      {/* Add some padding to account for fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}

export default NavBar

// Add this to your global CSS file
const styles = `
.nav-link {
  @apply link link-hover font-medium transition-colors duration-200;
}

.nav-link:hover {
  @apply text-primary;
}
`