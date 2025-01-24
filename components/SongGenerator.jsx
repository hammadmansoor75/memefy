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
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';



export const songSchema = z.object({
  description: z
    .string()
    .refine((val) => val.split(/\s+/).length <= 200, {
      message: 'Description must not exceed 200 words',
    }),
  genre: z
    .string()
    .refine((val) => val.split(/\s+/).length <= 50, {
      message: 'Genre must not exceed 50 words',
    }),
});


const SongGenerator = () => {

  const {isLoaded, userId} = useAuth();

  const { register, handleSubmit,reset, formState: { errors } } = useForm({
    resolver: zodResolver(songSchema),
  });

  const [submitLoading,setSubmitLoading] = useState(false);
  const [songs,setSongs] = useState([]);
  const [selectedSong,setSelectedSong] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const [deleteLoading,setDeleteLoading] = useState(false);
  const router = useRouter();

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const getPlaylists = async () => {
    try {
        const response = await axios.get("/api/playlist");
        if(response.status === 200){
            setPlaylists(response.data.playlists)
        }
        
    } catch (error) {
        console.log(error);
    }
  }

  const getSongs = async () => {
    try {
      const response = await axios.get('/api/get-songs');
      if (response.status === 200) {
        setSongs(response.data.songs);
        setSelectedSong(response.data.songs[0])
        console.log(response.data);
      } else {
        console.log('Error Getting Songs');
      }
    } catch (error) {
      console.log('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    getSongs();
    getPlaylists();
  },[]);

  const onSubmit = async (data) => {
    try{
      if(!isLoaded || !userId){
        router.push('/sign-in')
      }
      console.log(data);
      setSubmitLoading(true)
      const response = await axios.post('/api/generate-song-suno', {
        ...data
      })
      if(response.status === 200){
        await getSongs();
        reset();
      }else{
        console.log("Something went wrong")
      }
    }catch(error){
      console.log(error);
    }finally{
      setSubmitLoading(false);
    }
    // Handle form submission logic here
  };

  const handleAddToPlaylist = async (playlist) => {
    if (!playlist){
      alert("Please Select a Playlist First");
      return
    }

    try {
      setPlaylistLoading(true)
      const response = await axios.post('/api/add-song-to-playlist', {
        songId: selectedSong.id,
        playlistId: playlist.id,
      });

      if (response.status === 200) {
        console.log('Song added to playlist');
        
      } else {
        console.log('Error adding song to playlist');
      }
    } catch (error) {
      console.log('Error adding song to playlist:', error);
    } finally{
      setPlaylistLoading(false);
      setIsDialogOpen(false);  // Close the dialog after successful addition
    }
  };

  async function downloadFileDirectly() {
    if (!selectedSong) {
      alert("Please Select a Song First");
      return
    }
    const newTab = window.open(selectedSong.songUploadUrl, '_blank');
    if (!newTab) {
      alert('Failed to open the link in a new tab. Please check your browser settings.');
    } else {
      newTab.focus();
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
      if(!selectedSong){
        alert("Please Select a Song First");
        return;
      }

      const response = await axios.post('/api/delete-song', {
        songId : selectedSong.id
      });

      if(response.status === 200){
        alert("Song Deleted!");
        await getSongs();
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

  return (
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
        <div className='flex flex-col items-center justify-center' >
            <h2 className='text-white text-center font-bold text-[16px] mt-5' >GENERATE. SHARE. MEMFY</h2>
            <h1 className='text-white text-center text-[31px] mt-4' >Song Generator</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-10 px-5' >
                {submitLoading ? <div className='flex flex-col items-center justify-center border border-white rounded-lg gap-4 bg-yellow p-5' >
                  <ClipLoader size={30} color='black' />
                  <p className='text-md text-black text-center w-full lg:w-1/2' >We are currently generating your song! It will approximately take 3-4 minutes. Kindly dont leave this page.</p>
                </div> : <div>
                  <div className='grid sm:grid-cols-1 lg:grid-cols-2 justify-between gap-10 w-full ' >
                    <div className='flex flex-col w-full col-span-1' >
                        <label className='text-white text-[12px]' >Song Description</label>
                            <textarea
                              {...register('description')}
                              placeholder='Examples: Elon Musk Hating on Ethereum; Vitalik Buterin the MacDonalds Employee'
                              className='mt-2 p-5 border border-white text-white rounded-xl bg-background resize-none text-[10px] md:w-[300px] lg:w-[400px] min-h-[200px]'
                            />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>
                    <div className='flex flex-col w-full col-span-1' >
                        <label className='text-white text-[12px]' >Genre</label>
                            <textarea
                              {...register('genre')}
                              placeholder='Examples: Hard Rap Song, Classic Rock Song, Acoustic Future Bass'
                              className='mt-2 p-5 border text-white border-white rounded-xl bg-background   resize-none text-[10px] md:w-[300px] lg:w-[400px] min-h-[200px]'
                            />
                        {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
                    </div>
                    
                </div>
                <div className='flex items-center justify-center mt-5'>
                    <button type='submit' className='yellow-button flex items-center justify-center gap-2 mt-5' >
                        <IoMusicalNotesOutline size={15}  />
                        <span>GENERATE</span>
                    </button>
                </div>
                </div>}
            </form>
        </div>

        <div className="mt-10" >
          <h1 className='text-white text-xl font-semibold text-center' >Your Generated Songs</h1>
          <div className='flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4' >
            <div className='w-full lg:w-2/3' >
              {songs && songs.length > 0 && songs.map((song) => (
                <div className={`w-full cursor-pointer h-auto md:h-[86px] px-2 md:px-5 py-2 ${selectedSong?.id === song.id ? 'border border-white bg-inherit' : 'bg-background'} mt-5 rounded-lg`} onClick={() => setSelectedSong(song)}  key={song.id} >
                  <div className='flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20' >
                    <div className='flex items-center justify-center gap-5' >
                    <Image src={song?.songImage || '/assets/song-image-1.svg'} alt="song-image" layout='intrinsic' width={70} height={70} className="rounded-lg object-cover" />
                      <div>
                        <h1 className='text-white font-semibold text-sm' >{song.title}</h1>
                        <p className='text-white font-extralight text-xs' >
                          {song.tags}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center gap-2 md:gap-4' >
                          <div className='text-yellow relative group' onClick={handleDelete} >{song.id === selectedSong?.id ? deleteLoading ? <ClipLoader color='white' /> : <><MdDelete size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</span></> : <><MdDelete size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</span></> }</div>
                          <div className='text-yellow relative group' onClick={downloadFileDirectly} ><IoMdDownload size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Download</span></div>
                          <div className='text-yellow relative group' onClick={handleShare} ><FaShareAltSquare size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Share</span></div>
                          <div className='text-yellow relative group' onClick={toggleDialog} ><SlPlaylist size={17} /><span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-yellow text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Add to Playlist</span></div>
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
                <p className='text-white font-extralight text-sm whitespace-pre-wrap text-opacity-65 text-center' >{selectedSong.lyrics}</p>
              </div> : <div className='' >
                <p className='text-white text-xl font-medium text-center' >Select a song to see content!</p>
              </div>}
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-background border border-white p-5 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Select Playlist</h2>
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`cursor-pointer p-2 border rounded-lg ${playlist.id === selectedPlaylist?.id ? 'bg-yellow text-black' : 'text-white'}`}
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  {playlist.name}
                </div>
              ))}
              <div className='flex items-center justify-center'  ><button className='yellow-button' onClick={() => router.push('/playlist')} >Create Playlist</button></div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                className="px-4 py-2 transparent-button rounded-md"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 yellow-button rounded-md"
                onClick={() => handleAddToPlaylist(selectedPlaylist)}
              >
                {playlistLoading ?  'Adding' : 'Add to Playlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mt-10' ></div>

      {selectedSong && (
        <div className='sticky border border-white bottom-[-300px] md:bottom-[-130px] right-0 w-full bg-white bg-opacity-10 pl-2 rounded-md' >
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
            // controls 
          />
          </div>
          
        </div>
      )}
    </div>
  )
}

export default SongGenerator