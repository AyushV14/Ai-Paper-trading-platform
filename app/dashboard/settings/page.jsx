import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const Settings = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <UserProfile/>
    </div>
  )
}

export default Settings