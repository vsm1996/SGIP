// 'use client'
// 
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { BellAlertIcon } from '@heroicons/react/24/outline'
// import apiClient from '@/services/api-client'
// import ErrorMessage from '@/components/errorMessage'
// 
// interface Mention {
//   id: string
//   unread: boolean
// }
// 
// interface ApiError {
//   response?: {
//     data?: {
//       message?: string
//     }
//   }
//   message?: string
// }
// 
// const NotificationsBar = () => {
//   const { data: session } = useSession()
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [errors, setErrors] = useState<string[]>([])
// 
//   useEffect(() => {
//     const controller = new AbortController()
// 
//     const fetchUnreadMentions = async () => {
//       if (session?.sub) {
//         try {
//           const response = await apiClient.get(`/mentions/${session.sub}`, {
//             signal: controller.signal
//           })
//           const mentions = response.data?.mentions || []
//           const unreadMentions = mentions.filter((mention: Mention) => mention.unread)
//           setUnreadCount(unreadMentions.length)
//         } catch (error) {
//           // Ignore canceled requests
//           if (!error || Object.keys(error).length === 0) {
//             return;
//           }
// 
//           let errorMessage = 'Error fetching unread mentions';
//           const apiError = error as ApiError;
//           if (apiError?.response?.data?.message) {
//             errorMessage = apiError.response.data.message;
//           } else if (apiError?.message) {
//             errorMessage = apiError.message;
//           }
// 
//           setErrors([errorMessage])
//           setUnreadCount(0)
//         }
//       }
//     }
// 
//     fetchUnreadMentions()
//     const interval = setInterval(fetchUnreadMentions, 30000) // Poll every 30 seconds
// 
//     return () => {
//       clearInterval(interval)
//       controller.abort()
//     }
//   }, [session])
// 
//   return (
//     <nav className='mb-8'>
//       {errors.length > 0 && <ErrorMessage error={errors} />}
//       <ul>
//         <li>
//           <Link
//             href="/mentions"
//             className="link link-hover mr-5"
//             aria-label='notifications page link'
//           >
//             <div className='relative w-8'>
//               {unreadCount > 0 && (
//                 <span className="badge badge-xs badge-primary absolute top-0 right-0">
//                   {unreadCount}
//                 </span>
//               )}
//               <BellAlertIcon className='' />
//             </div>
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   )
// }
// 
// export default NotificationsBar
