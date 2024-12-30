import ProjectPlans from '@/components/ProjectPlans'
import RoadmapCard from '@/components/RoadmapCard'
import Image from 'next/image'
import React from 'react'

const RoadmapPage = () => {
  return (
    <main className='px-5 md:px-10 py-10 w-full' >
      <RoadmapCard />
      <ProjectPlans />
      <div className='mt-10' >
        <h1 className='text-center text-2xl text-white' >Marketing after Fair Launch</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 items-center justify-center mt-10' >
          <div className='border border-white rounded-3xl py-3 px-5' >
            <div className='flex items-center justify-center mb-2' >
              <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                  <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                    <p className='text-xl text-black font-semibold' ><Image src='/assets/dex-icon-1.svg' alt='dex-icon' height={30} width={30} /></p>
                  </div>
              </div>
            </div>
            <h3 className='text-white text-center text-lg' >Dexscreener Update</h3>
          </div>
          <div className='border border-white rounded-3xl py-3 px-5' >
            <div className='flex items-center justify-center mb-2' >
              <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                  <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                    <p className='text-xl text-black font-semibold' ><Image src='/assets/dex-icon-2.svg' alt='dex-icon' height={30} width={30} /></p>
                  </div>
              </div>
            </div>
            <h3 className='text-white text-center text-lg' >Dex 500x Boost</h3>
          </div>
          <div className='border border-white rounded-3xl py-3 px-5' >
            <div className='flex items-center justify-center mb-2' >
              <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                  <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                    <p className='text-xl text-black font-semibold' ><Image src='/assets/dex-icon-3.svg' alt='dex-icon' height={30} width={30} /></p>
                  </div>
              </div>
            </div>
            <h3 className='text-white text-center text-lg' >DexTools Banner</h3>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 items-center justify-center mt-10' >
          <div className='border border-white rounded-3xl py-3 px-5' >
            <div className='flex items-center justify-center mb-2' >
              <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                  <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                    <p className='text-xl text-black font-semibold' ><Image src='/assets/dex-icon-4.svg' alt='dex-icon' height={30} width={30} /></p>
                  </div>
              </div>
            </div>
            <h3 className='text-white text-center text-lg' >Twitter Raids & Ads</h3>
          </div>
          <div className='border border-white rounded-3xl py-3 px-5' >
            <div className='flex items-center justify-center mb-2' >
              <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                  <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                    <p className='text-xl text-black font-semibold' ><Image src='/assets/dex-icon-5.svg' alt='dex-icon' height={30} width={30} /></p>
                  </div>
              </div>
            </div>
            <h3 className='text-white text-center text-lg' >Giveaways & Contests</h3>
          </div>
          <div className='border border-white rounded-3xl py-3 px-5' >
            <div className='flex items-center justify-center mb-2' >
              <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                  <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                    <p className='text-xl text-black font-semibold' ><Image src='/assets/dex-icon-6.svg' alt='dex-icon' height={30} width={30} /></p>
                  </div>
              </div>
            </div>
            <h3 className='text-white text-center text-lg' >CEX Listings</h3>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RoadmapPage