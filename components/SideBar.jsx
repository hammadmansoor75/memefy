"use client"

import React from 'react'
import {SignOutButton} from '@clerk/nextjs'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { RxDashboard } from "react-icons/rx";
import { LuAudioLines } from "react-icons/lu";
import { FaWifi } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { FaCirclePlay } from "react-icons/fa6";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';





const links = [
    {
        title : 'Dashboard',
        url : '/',
        icon : <RxDashboard/>
    },
    {
        title : 'Playlist',
        url : '/playlist',
        icon : <LuAudioLines/>
    },
    {
        title : 'Roadmap',
        url : '/roadmap',
        icon : <FaWifi/>
    },
    {
        title : 'Community',
        url : '/community',
        icon : <FaRegHeart/>
    },
    {
        title : 'Leaderboard',
        url : '/leaderboard',
        icon : <MdLeaderboard/>
    }
]

const SideBar = () => {
    const pathname = usePathname();
  return (
    <Sidebar >
        <SidebarHeader className="px-10 mt-10" >
            <div className='flex items-center justify-start gap-2' >
                <FaCirclePlay />
                <h1 className='text-white font-semibold' >MEMFY</h1>
            </div>
        </SidebarHeader>
        <SidebarContent className="p-5" >
            <SidebarGroup className="mt-5" >
                <SidebarGroupLabel className="text-lg font-extralight text-white" >Main Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {links.map((item) => (
                            <SidebarMenuItem className="mt-5"  key={item.title} >
                                <SidebarMenuButton asChild>
                                    <Link href={item.url} className={`flex gap-4 ${pathname === item.url ? 'text-yellow' : 'text-white'}`} >
                                        {item.icon}
                                        <span className='text-md' >{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <div className='flex flex-col items-center justify-center gap-4' >
                <SignOutButton redirectUrl='/sign-in' ><button className='transparent-button' >SIGN OUT</button></SignOutButton>
                <button className='yellow-button' >BUY $MEMFY</button>
                <div className='flex items-center justify-start gap-4 mt-1' >
                    <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon1.svg'} alt='icon' height={30} width={30} />
                    <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon2.svg'} alt='icon' height={30} width={30} />
                    <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon3.svg'} alt='icon' height={30} width={30} />
                    <Image className='border-2 cursor-pointer border-yellow rounded-full p-1' src={'/assets/icon4.svg'} alt='icon' height={30} width={30} />
                </div>
            </div>
        </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar
