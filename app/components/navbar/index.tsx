import React from 'react'

import ThemeController from '../themeController'

import Authenticated from './authenticated'
import Unauthenticated from './unauthenticated'

const NavBar = () => {

  return (
    <nav className='p-5 navbar bg-base-300 z-10 fixed top-0 left-0 text-base-content'>
      <ul className='w-full flex items-center max-sm:justify-between'>
        <li className='mr-6 lg:mr-9'>
          <ThemeController />
        </li>
        <Authenticated />
        <Unauthenticated />
      </ul>
    </nav>
  )
}

export default NavBar
