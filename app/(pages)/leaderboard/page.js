import Link from 'next/link'
import React from 'react'

const LeaderBoardPage = () => {
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
        <div className='flex flex-col w-full h-full items-center justify-center' >
          <h1 className='mt-10 text-white text-center text-[31px]' >Leaderboard</h1>
          <p className='mt-10 uppercase text-center px-4 md:px-10 text-white text-[20px]' >WIN UP TO 1 SOL EVERYDAY SIMPLY BY POSTING YOURGENERATED SONG INTO THE COMMUNITY.THE BEST SONGS WIN.</p>
          <div className='mt-10 flex flex-col md:flex-row gap-5 items-center justify-center' >
            <Link href='/' ><button className='yellow-button' >GENERATE SONG</button></Link>
            <button className='transparent-button' >READ MORE</button>
          </div>
        </div>
      </div>
      
      

    </div>

    <div className='mt-10 container mx-auto w-full' >
      <div
          className="w-full py-5 sm:min-h-[500px] md:h-[500px] lg:h-[500px] rounded-3xl"
          style={{
            backgroundImage: `url('/assets/top-artists.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          
        </div>
    </div>

    <div className='mt-10 container mx-auto w-full' >
      <div
          className="w-full py-5 sm:min-h-[600px] md:h-[600px] lg:h-[600px] rounded-3xl"
          style={{
            backgroundImage: `url('/assets/leaderboard.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          
            <h1 className='text-yellow mt-10 font-bold text-center text-5xl uppercase' >Coming Soon</h1>
          
        </div>
    </div>
  </main>
  )
}

export default LeaderBoardPage