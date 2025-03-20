import React from 'react'
import Timeline from './timeline'
import NotifcationsBar from '../components/notifications'


const DashboardPage = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center px-6 md:px-12'>
      <NotifcationsBar />
      <Timeline />
    </div>
  )
}

export default DashboardPage
