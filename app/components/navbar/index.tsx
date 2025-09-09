'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BellAlertIcon, BookmarkIcon, ChatBubbleLeftRightIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
        } catch (error: any) {
          // Ignore AbortError (caused by component unmount)
          if (error.name === 'CanceledError' || error.name === 'AbortError') {
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
      <nav className='px-4 py-3 navbar bg-base-200/95 backdrop-blur-sm z-10 fixed top-0 left-0 right-0 shadow-lg max-lg:text-sm border-b border-base-300'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center w-full'>
            {/* Left section */}
            <div className='flex items-center space-x-4'>
              <ThemeController />
              {status === 'authenticated' && (
                <Link href='/settings' className='hidden lg:flex btn btn-ghost btn-sm items-center space-x-2 hover:hover:bg-base-300/50'>
                  <UserCircleIcon className="w-5 h-5" />
                  <span className='text-sm'>{displayName}</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button - only visible on small screens */}
            <button
              className="lg:hidden btn btn-ghost btn-circle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* Center section - main navigation - hidden on mobile */}
            {status === 'authenticated' && (
              <div className='hidden lg:flex items-center space-x-6'>
                <Link href='/dashboard' className='nav-link max-lg:hidden inline-block hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Dashboard
                </Link>
                <Link href='/dashboard' className='nav-link max-lg:inline-block hidden hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Dash
                </Link>
                <Link href='/rooms' className='nav-link hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Rooms
                </Link>
                <Link href='/forums' className='nav-link hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Forums
                </Link>
                <Link target="_blank" href='https://www.youtube.com/@george128306' className='nav-link max-lg:hidden inline-block hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Video Lectures
                </Link>
                <Link target="_blank" href='https://www.youtube.com/@george128306' className='nav-link max-lg:inline-block hidden hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Lectures
                </Link>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="btn btn-primary btn-sm normal-case flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                  aria-label='create discussion room'
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span className="inline">Create Room</span>
                </button>
              </div>
            )}

            {/* Right section - user actions */}
            <div className='hidden lg:flex items-center space-x-4'>
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/bookmarks"
                    className="btn btn-ghost btn-circle hover:bg-base-300/50 m-0"
                    aria-label='bookmarks'
                  >
                    <BookmarkIcon className='w-5 h-5' />
                  </Link>
                  <Link
                    href="/mentions"
                    className="btn btn-ghost btn-circle hover:bg-base-300/50"
                    aria-label='notifications'
                  >
                    <div className='relative'>
                      <BellAlertIcon className='w-5 h-5' />
                      {unreadCount > 0 && (
                        <span className="badge badge-sm badge-primary badge-ping absolute -top-3 -right-3">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="divider divider-horizontal"></div>
                  <Link href='/api/auth/signout' className='btn btn-ghost btn-sm hover:border-b-2 transition-all duration-100 ease-in-out'>
                    Sign Out
                  </Link>
                </>
              ) : (
                <Link href='/api/auth/signin' className='btn btn-primary btn-sm hover:border-b-2 transition-all duration-100 ease-in-out'>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - slide down when open */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-base-200/95 backdrop-blur-sm z-50 shadow-lg border-b border-base-300 md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {status === 'authenticated' ? (
              <>
                <Link
                  href='/dashboard'
                  className='nav-link py-2 block hover:bg-base-300/50 px-3 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href='/rooms'
                  className='nav-link py-2 block hover:bg-base-300/50 px-3 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rooms
                </Link>
                <Link
                  href='/forums'
                  className='nav-link py-2 block hover:bg-base-300/50 px-3 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forums
                </Link>
                <Link
                  target="_blank"
                  href='https://www.youtube.com/@george128306'
                  className='nav-link py-2 block hover:bg-base-300/50 px-3 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lectures
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setShowCreateRoom(true)
                  }}
                  className="btn btn-primary btn-sm normal-case flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 w-full justify-center"
                  aria-label='create discussion room'
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Create Room</span>
                </button>

                <div className="flex justify-between items-center pt-2 border-t border-base-300">
                  <div className="flex space-x-4">
                    <Link
                      href="/bookmarks"
                      className="btn btn-ghost btn-circle hover:bg-base-300/50 m-0"
                      aria-label='bookmarks'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookmarkIcon className='w-5 h-5' />
                    </Link>
                    <Link
                      href="/mentions"
                      className="btn btn-ghost btn-circle hover:bg-base-300/50 m-0"
                      aria-label='notifications'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className='relative'>
                        <BellAlertIcon className='w-5 h-5' />
                        {unreadCount > 0 && (
                          <span className="badge badge-sm badge-primary badge-ping absolute -top-4 -right-4">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link
                      href='/settings'
                      className='btn btn-ghost btn-circle hover:hover:bg-base-300/50 m-0'
                      aria-label='profile settings'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                    </Link>
                  </div>
                  <Link
                    href='/api/auth/signout'
                    className='btn btn-ghost btn-sm'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Out
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  target="_blank"
                  href='https://www.youtube.com/@george128306'
                  className='nav-link py-2 block hover:bg-base-300/50 px-3 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Video Lectures
                </Link>
                <div className="pt-2 border-t border-base-300">
                  <Link
                    href='/api/auth/signin'
                    className='btn btn-primary btn-sm w-full justify-center'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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