import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";
import { NextResponse } from 'next/server';

export async function POST(req){
    try {
        const {playlistId} = await req.json();

        const playlist = await prisma.playlist.findUnique({
            where: { id: playlistId },
        })

        const songIds = playlist.songs;

        const songs = await prisma.song.findMany({
            where: {
              id: { in: songIds },
            },
        });

        return NextResponse.json({ songs, playlist }, {message : "Song Get"}, {status : 200});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}