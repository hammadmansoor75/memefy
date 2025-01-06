"use client"

import React, { useEffect, useState } from 'react'
import { IoMusicalNotesOutline } from "react-icons/io5";
import * as z from 'zod'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { FaShareAltSquare } from "react-icons/fa";
import { SlPlaylist } from "react-icons/sl";
import Image from 'next/image';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


const PlaylistSubPage = () => {

    const {userId, isLoaded} = useAuth();
    const router = useRouter();

    const [songs,setSongs] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [selectedSong,setSelectedSong] = useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);


    if(!isLoaded || !userId){
      router.push('/sign-in')
    }


    const getPlaylist = async (id) => {
        try {
            const response = await axios.post('/api/get-playlist', {
                playlistId : id
            })

            if(response.status === 200){
                setSongs(response.data.songs);
                if(response.data.songs.length > 0){
                  setSelectedSong(response.data.songs[0])
                }
                setPlaylist(response.data.playlist)
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
                getPlaylist(idFromPath)
            }
        }
    },[])

    const  downloadFileDirectly = async () => {
        try{
            if (!selectedSong) {
                alert("Please Select a Song First");
                return
              }
      
              const fileUrl = selectedSong.songUploadUrl;
              const fileName = `${selectedSong.title}.mp3`
      
              const link = document.createElement("a");
              link.href = fileUrl;
              link.download = fileName;
              link.target = "_blank"
              link.click();

        }catch(error){
            alert("Something went wrong while downloading. Please Try Again!")
        }

      }
    
      const handleShare = () => {
        if (!selectedSong){
          alert("Please Select a Song First");
          return
        }
        const appUrl = window.location.origin;
        navigator.clipboard.writeText(`${appUrl}/song/${selectedSong.id}`)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch((error) => {
            alert("Failed to copy! Try Again")
            console.error('Failed to copy link:', error);
          });
      }
    
    
      const handleDelete = async () => {
        try {
          setDeleteLoading(true);
          if(!selectedSong && playlist){
            alert("Please Select a Song First");
            return;
          }
    
          const response = await axios.post('/api/remove-song-from-playlist', {
            songId : selectedSong.id,
            playlistId : playlist.id
          });
    
          if(response.status === 200){
            await getPlaylist(playlist.id);
            setDeleteLoading(false)
            alert("Song Removed From Playlist!");
          }else{
            alert("Something went wrong!")
          }
        } catch (error) {
          console.log(error)
          alert("Something went wrong!")
        } finally{
          setDeleteLoading(false)
        }
      }


      const playNextSong = () => {
        const nextIndex = (currentIndex + 1) % songs.length; // Loop back to the start
        setCurrentIndex(nextIndex);
        setSelectedSong(songs[nextIndex]);
    };

    const handlePlaySong = (index) => {
        setCurrentIndex(index);
        setSelectedSong(songs[index]);
    };

    

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
            <h1 className='text-white mt-10 text-4xl font-semibold text-center' >Playlist</h1>
            <div className='mt-5 px-5' >
                <div className='flex items-center justify-start gap-5' >
                    <Image src={playlist?.image || '/assets/song-img-1.svg'} height={100} width={100} alt='playlist-image' className='rounded-lg' />
                    <div>
                        <h1 className='text-white text-2xl font-medium' >{playlist.name}</h1>
                        <p className='mt-2 text-white text-lg' >Songs {songs?.length}</p>
                    </div>
                </div>
            </div>
            <div className="mt-10" >
              
              <div className='flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4' >
                <div className='w-full lg:w-2/3' >
                  {songs && songs.length > 0 && songs.map((song,index) => (
                    <div className={`w-full cursor-pointer h-auto md:h-[86px] px-2 md:px-5 py-2 ${selectedSong?.id === song.id ? 'border border-white bg-inherit' : 'bg-background'} mt-5 rounded-lg`} onClick={() => handlePlaySong(index)}  key={song.id} >
                      <div className='flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20' >
                        <div className='flex items-center justify-start gap-5' >
                          <Image src={song?.songImage || '/assets/song-image-1.svg'} alt="song-image" layout='intrinsic' width={70} height={70} className="rounded-lg" />
                          <div>
                            <h1 className='text-white font-semibold text-sm' >{song.title}</h1>
                            <p className='text-white font-extralight text-xs' >
                              {song.tags}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center justify-center gap-2 md:gap-4' >
                              <div className='text-yellow relative group' onClick={handleDelete} >{song.id === selectedSong?.id ? deleteLoading ? <ClipLoader color='white' /> : <><MdDelete size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Remove</span></> : <><MdDelete size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Remove</span></>}</div>
                              <div className='text-yellow relative group' onClick={downloadFileDirectly}  ><IoMdDownload size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Download</span></div>
                              <div className='text-yellow relative group' onClick={handleShare} ><FaShareAltSquare size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Share</span></div>
                              
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
    
                <div className='p-5 border-2 border-white rounded-xl w-full lg:w-1/3' >
                  {selectedSong ? <div className='flex flex-col items-center justify-center gap-5' >
                    <Image src={selectedSong.songImage || "/assets/song-img-2.svg"} alt='song-image' height={200} width={200} className='rounded-lg' />
                    <h1 className='text-white font-semibold text-2xl text-center' >{selectedSong.title}</h1>
                    <p className='text-white font-extralight text-sm text-opacity-65' >{selectedSong.tags} </p>
                    <p className='text-white font-extralight text-sm whitespace-pre-wrap text-center text-opacity-65' >{selectedSong.lyrics}</p>
                  </div> : <div className='' >
                    <p className='text-white text-xl font-medium text-center' >Select a song to see content!</p>
                  </div>}
                </div>
              </div>
            </div>

            {selectedSong && (
        <div className='sticky mt-5 border border-white bottom-[-300px] md:bottom-[-130px] right-0 w-full bg-white bg-opacity-10 pl-2 rounded-lg' >
          <div className='flex flex-col md:flex-row items-center justify-start gap-5' >
            <Image src={selectedSong.songImage || '/assets/song-img-1.svg'} alt='song-img' height={50} width={50} className='rounded-md' />
            <div>
              <h1 className='text-white text-sm font-semibold' >{selectedSong.title}</h1>
              <p className='text-white text-xs font-extralight' >{selectedSong.tags}</p>
            </div>
            <AudioPlayer
            className='w-full p-4 shadow-lg bg-inherit !important'
            src={selectedSong.songUploadUrl}
            autoplay
            onEnded={playNextSong}
            controls 
          />
          </div>
          
        </div>
      )}
        </div>
      </div>
    </main>
  )
}

export default PlaylistSubPage
