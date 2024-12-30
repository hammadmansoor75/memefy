"use client"

import HomeCard from '@/components/HomeCard'
import SongGenerator from '@/components/SongGenerator'
import React from 'react'

const page = () => {
  return (
    <main className='p-10 w-full' >
      <HomeCard />
      <SongGenerator />
    </main>
  )
}

export default page
