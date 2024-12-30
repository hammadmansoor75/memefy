"use client"

import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const schema = z.object({
    name : z.string(),
    description : z.string()
})




const PlaylistCard = () => {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const { register, handleSubmit,reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const [playlists, setPlaylists] = useState([]);

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

    useEffect(() => {
        getPlaylists();
    },[])

    const [loading,setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/playlist' , {
                ...data
            });
            if(response.status === 200){
                console.log(response.data);
                await getPlaylists();
                reset();
            }else{
                console.log(response.data)
            }
        } catch (error) {
            console.log(error);            
        } finally{
            setLoading(false);
            toggleOpen();
        }
    }

    const toggleOpen = () => setOpen(!open);

    const handleRedirect = (playlistId) => {
        router.push(`/playlist/${playlistId}`);
    }


  return (
    <div className="container mx-auto w-full" >
        <div
        className="w-full py-5 sm:min-h-[500px] md:h-[500px] lg:h-[530px] rounded-3xl"
        style={{
          backgroundImage: `url('/assets/bg-card.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <h1 className='text-white text-4xl font-semibold text-center m-5' >Playlists</h1>

        <div className='flex items-start justify-start flex-wrap gap-10 p-10' >
            <button onClick={toggleOpen} className='w-[130px] h-[140px] p-5 flex flex-col items-center justify-center gap-2 rounded-3xl bg-background text-white text-md border border-white' ><FaPlus size={20} /> <span>Create Playlist</span></button>
            {playlists && playlists.length > 0 && playlists.map((single) => (
                <div onClick={() => handleRedirect(single.id)} key={single.id} className='flex cursor-pointer flex-col items-center justify-center' >
                    <Image className='rounded-lg' src={single.image || '/assets/song-img-1.svg'} alt='playlist-img' height={120} width={120} />
                    <h1 className='mt-1 text-white text-md font-semibold text-center' >{single.name}</h1>
                </div>
            ))}
        </div>


        {open && (
            <div className='fixed inset-0  flex items-center justify-center bg-black bg-opacity-50' >
                <div className='relative border-white border bg-background p-5 rounded-3xl' >
                    <button onClick={toggleOpen} className='absolute cursor-pointer top-4 right-4 text-white' ><MdOutlineCancel size={20} /></button>
                    <h1 className='mt-5 text-center text-white text-2xl font-semibold' >Create Playlist</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className='mt-5 w-full' >
                        <input {...register('name')} className='bg-inherit w-full text-white border border-white rounded-md px-5 py-2 placeholder:text-white' type='text' placeholder='Enter Playlist Name' />
                        {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
                        <input {...register('description')} className='bg-inherit mt-5 w-full text-white border border-white rounded-md px-5 py-2 placeholder:text-white h-36' type='text' placeholder='Enter Playlist Description' />
                        {errors.description && <p className="text-red-500 mt-2 text-sm">{errors.description.message}</p>}
                        <div className='flex mt-5 items-center justify-end' >
                            <button type='submit' className='bg-yellow text-black text-center p-3 rounded-md' >{loading ? 'Saving' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  )
}

export default PlaylistCard