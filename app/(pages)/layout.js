
import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBar from '@/components/SideBar'


const PagesLayout = ({children}) => {
  return (
    <SidebarProvider>
        <SideBar/>
        <main className='w-full h-full mt-2 ml-2' >
            <div className='block md:hidden' ><SidebarTrigger /></div>
            {children}
        </main>
    </SidebarProvider>
  )
}

export default PagesLayout
