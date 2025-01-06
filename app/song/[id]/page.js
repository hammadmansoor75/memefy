"use client"

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const SongPage = () => {

    const [song,setSong] = useState(null);

    const getSong = async (id) => {
        try {
            const response = await axios.post('/api/get-song', {
                id : id
            })

            if(response.status === 200){
                setSong(response.data.song);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        if(typeof window !== 'undefined'){
            const urlPath = window.location.pathname;
            const idFromPath = urlPath.split("/").pop();
            if(idFromPath){
                getSong(idFromPath)
            }
        }
    },[])
  return (
    <main className='p-10 w-full' >
        <div className='mt-10 container relative mx-auto w-full' >
            <div
                className="w-full mb-10 p-5 sm:min-h-[500px] md:min-h-[500px] lg:min-h-[530px] rounded-3xl"
                style={{
                backgroundImage: `url('/assets/generator-bg.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                }}
            >
                <h1 className='text-white mt-10 text-4xl font-semibold text-center' >Song</h1>

                <div className='mt-10 px-5' >
                    <div className='flex items-center justify-start gap-5' >
                        <Image src={song?.songImage || '/assets/song-img-1.svg'} height={150} width={150} alt='playlist-image' className='rounded-lg' />
                        <div>
                            <h1 className='text-white text-2xl font-medium' >{song?.title}</h1>
                            <p className='mt-2 text-white text-lg' >{song?.tags}</p>
                        </div>
                    </div>
                </div>

                <p className='text-center text-white text-md mt-5 whitespace-pre-wrap' >{song?.lyrics}</p>

                <div className='mt-10 border border-white bottom-[-300px] md:bottom-[-130px] right-0 w-full bg-white bg-opacity-10 pl-2 rounded-lg' >
                    <div className='flex flex-col md:flex-row items-center justify-start gap-5' >
                        <Image src={song?.songImage || '/assets/song-img-1.svg'} alt='song-img' height={50} width={50} className='rounded-md' />
                        <div>
                            <h1 className='text-white text-sm font-semibold' >{song?.title}</h1>
                            <p className='text-white text-xs font-extralight' >{song?.tags}</p>
                        </div>
                        <AudioPlayer
                            className='w-full p-4 shadow-lg bg-inherit !important'
                            src={song?.songUploadUrl}
                            autoplay
                            controls 
                    />
                    </div>
                    
                </div>

            </div>
        </div>
    </main>
  )
}

export default SongPage
