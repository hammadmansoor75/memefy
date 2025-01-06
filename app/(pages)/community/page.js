import Link from 'next/link'
import React from 'react'

const Community = () => {
  return (
    <main className='p-10 w-full' >
      <div className="container mx-auto w-full">
        <div
          className="w-full py-5 sm:min-h-[500px] md:h-[500px] lg:h-[550px] rounded-3xl"
          style={{
            backgroundImage: `url('/assets/community-bg.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className='flex w-full h-full flex-col items-center justify-center' >
            <h1 className='mt-10 text-white text-center text-[31px]' >Community</h1>
            <p className='mt-10 uppercase text-center px-4 md:px-10 text-white text-[20px]' >Publish your generated songs to the community with one simple click. The communitycan then like, share & upvoteyour song.</p>
            <div className='mt-10 flex flex-col md:flex-row gap-5 items-center justify-center' >
              <Link href='/' ><button className='yellow-button' >GENERATE SONG</button></Link>
              <button className='transparent-button' >READ MORE</button>
            </div>
          </div>
        </div>
        
        

      </div>

      <div className='mt-10 container mx-auto w-full' >
        <div
            className="w-full py-5 sm:min-h-[1000px] md:h-[1200px] lg:h-[1522px] rounded-3xl"
            style={{
              backgroundImage: `url('/assets/community-songs.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className='w-full h-full flex items-center justify-center' >
              <h1 className='text-yellow font-bold text-center text-5xl uppercase' >Coming Soon</h1>
            </div>
          </div>
      </div>
    </main>
  )
}

export default Community