import React, { Suspense } from 'react'
import Timeline from './timeline'

const DashboardPage = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center px-6 md:px-12'>
      <Suspense fallback={<div className=" loading loading-ring loading-lg"></div>}>
        <Timeline />
      </Suspense>
    </div>
  )
}

export default DashboardPage
