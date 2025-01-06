"use client"

import PlaylistCard from '@/components/PlaylistCard'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { ClipLoader } from 'react-spinners'

const PlaylistPage = () => {

  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return <div className='flex items-center justify-center w-full h-full' ><ClipLoader size={50} color='white' /></div>; // Show a loading state until authentication is loaded.
  }

  if (!userId) {
    return null; // Avoid rendering the page content when redirecting.
  }
  return (
    <main className='p-10 w-full' >
      <PlaylistCard />
    </main>
  )
}

export default PlaylistPage