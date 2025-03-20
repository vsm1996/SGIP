import Link from 'next/link'
import React from 'react'

import { BellAlertIcon } from '@heroicons/react/24/outline'

const NotifcationsBar = () => {
  return (
    <nav className='mb-8'>
      <ul>
        <li>
          <Link
            href="/mentions"
            className="link link-hover mr-5"
            aria-label='notifications page link'
          >
            <div className='relative w-8'>
              <span className="badge badge-xs badge-primary absolute top-0 right-0"></span>
              <BellAlertIcon className='' />
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NotifcationsBar
