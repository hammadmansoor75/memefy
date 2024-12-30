import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";
import { NextResponse } from 'next/server';

export async function POST(req){
    try {
        const user = await currentUser();
        
        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        };

        const {songId} = await req.json();

        if(!songId){
            return NextResponse.json({message : "Song ID required!"}, {status : 400});
        }

        const deletedSong = await prisma.song.delete({
            where : {id : songId}
        })

        return NextResponse.json({message : "Song Deleted"}, {status : 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status : 500})
    }
}