import React from 'react'

const ProjectPlans = () => {
  return (
    <div className='mt-10 container mx-auto w-full' >
        <div
        className="w-full p-5 sm:min-h-[500px] md:min-h-[500px] lg:min-h-[530px] rounded-3xl"
        style={{
          backgroundImage: `url('/assets/generator-bg.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1 className='text-white text-center text-3xl' >Project Plans </h1>
        <div className='flex flex-col items-center justify-center gap-10 mt-10' >
            <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-10' >
                <div className='bg-transparent border border-white rounded-xl p-10' >
                    <div className='flex items-center justify-center mb-2' >
                        <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                            <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                                <p className='text-xl text-black font-semibold' >1</p>
                            </div>
                        </div>
                    </div>
                    <h1 className='text-white text-2xl text-center' >AI Song Development</h1>
                    <div className='text-center text-white text-xs' >
                        <p className='mt-5' >Train AI for professional-quality mixing and mastering to ensure clean, polished audio outputs.</p>
                        <p className='mt-5' >Develop a lyric generation model emphasizing crypto themes, Web3 culture, and blockchain narratives.</p>
                        <p className='mt-5' >Enhance genre versatility, covering EDM, hip-hop, lofi, hard rock and much more.</p>
                    </div>
                </div>
                <div className='bg-transparent border border-white rounded-xl p-10' >
                    <div className='flex items-center justify-center mb-2' >
                        <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                            <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                                <p className='text-xl text-black font-semibold' >2</p>
                            </div>
                        </div>
                    </div>
                    <h1 className='text-white text-2xl text-center' >Community Tabs</h1>
                    <div className='text-center text-white text-xs' >
                        <p className='mt-5' >Enable token holders to publish their AI-generated songs with customizable titles into the community.</p>
                        <p className='mt-5' >Introduce an upvote system to let the community rank the best tracks. Implement filters for easy song discovery.</p>
                        <p className='mt-5' > Track engagement metrics (plays, shares, votes) to foster interaction and synchronize with the leaderboard.</p>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-10' >
                <div className='bg-transparent border border-white rounded-xl p-10' >
                    <div className='flex items-center justify-center mb-2' >
                        <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                            <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                                <p className='text-xl text-black font-semibold' >3</p>
                            </div>
                        </div>
                    </div>
                    <h1 className='text-white text-2xl text-center' >Leaderboard & Rewards</h1>
                    <div className='text-center text-white text-xs' >
                        <p className='mt-5' >Launch a live leaderboard ranking system based on upvotes, shares, play counts & TG votes.
                        (Only for holders)</p>
                        <p className='mt-5' >Automate SOL prize distribution for top-performing songs on the leaderboard.</p>
                    </div>
                </div>
                <div className='bg-transparent border border-white rounded-xl p-10' >
                    <div className='flex items-center justify-center mb-2' >
                        <div className='flex items-center w-12 h-12 justify-center rounded-full p-1 border border-yellow' >
                            <div className='bg-yellow rounded-full w-10 h-10 flex items-center justify-center' >
                                <p className='text-xl text-black font-semibold' >4</p>
                            </div>
                        </div>
                    </div>
                    <h1 className='text-white text-2xl text-center' >NFT Implementation</h1>
                    <div className='text-center text-white text-xs'>
                        <p className='mt-5' >Allow creators to mint their AI-generated songs as unique NFTs with embedded metadata. </p>
                        <p className='mt-5' >Launch limited-edition NFT collections featuring top leaderboard songs or exclusive AI-generated tracks.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPlans