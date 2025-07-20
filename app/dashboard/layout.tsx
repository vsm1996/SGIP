import React from 'react'
import NichirenLibrary from '@/components/nichiren-library'

const DashboardLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <NichirenLibrary>
      {children}
    </NichirenLibrary>
  )
}

export default DashboardLayout
