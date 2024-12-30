import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";
import { NextResponse } from 'next/server';

export async function POST(req){
    try {
        const {playlistId, songId} = await req.json();
        if (!playlistId || !songId) {
            return NextResponse.json({message : "Playlist and Song Ids required!"}, {status : 400});
        }

        const updatedPlaylist = await prisma.playlist.update({
            where: { id: playlistId },
            data: {
              songs: {
                push: songId, // Add song to the playlist's song array
              },
            },
        });

        const updatedSong = await prisma.song.update({
            where: { id: songId },
            data: {
              playlists: {
                push: playlistId, // Add playlist to the song's playlists array
              },
            },
        });

        return NextResponse.json({ updatedPlaylist, updatedSong }, {message : "Song Added"}, {status : 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}