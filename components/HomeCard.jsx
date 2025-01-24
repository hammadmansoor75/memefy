import Image from 'next/image';
import React from 'react';

const HomeCard = () => {
  return (
    <div className="container mx-auto w-full">
      <div
        className="w-full sm:min-h-[500px] md:h-[500px] lg:h-[530px] rounded-3xl"
        style={{
          backgroundImage: `url('/assets/bg-card.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >


          
        
        
        <div className="flex justify-between h-full px-4 sm:px-6 md:px-8 lg:px-8">
            
          {/* Left Side (Empty Space) */}
          <div className="w-full lg:w-1/2 py-5 flex items-start justify-start flex-col">

          <div className='flex items-center justify-start gap-3 px-5' >
                <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon1.svg'} alt='icon' height={32} width={32} />
                <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon2.svg'} alt='icon' height={32} width={32} />
                <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon3.svg'} alt='icon' height={32} width={32} />
                <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon4.svg'} alt='icon' height={32} width={32} />
          </div>
            
          <div className='w-full h-full flex items-center justify-center' >
          <div className='flex flex-col items-center justify-center mt-5 md:px-3' >
                <h3 className='text-white text-center text-[16px]' >MEMEFY</h3>
                <h1 className='text-white text-center text-[31px] mt-2' >Crypto’s First <strong>AI-Powered</strong> Song Generator</h1>
                <div className='mt-7 flex flex-col lg:flex-row items-center justify-center gap-5' >
                    <button className='yellow-button' >
                        GENERATE SONG
                    </button>
                    <button className='transparent-button' >
                        BUY $MEMEFY
                    </button>
                </div>
            </div>
          </div>  
          </div>

          {/* Right Side (Image) */}
          <div className="relative h-full w-full md:w-1/2 hidden lg:flex items-center justify-center">
            <Image
              objectFit='cover'
              layout='fill'
              alt="vector"
              src="/assets/vector.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
