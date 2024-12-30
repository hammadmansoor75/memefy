import { currentUser } from '@clerk/nextjs/server';
import prisma from "@/prisma/client";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { playlistId, songId } = await req.json();

        // Validate request body
        if (!playlistId || !songId) {
            return NextResponse.json(
                { message: "Playlist and Song IDs required!" },
                { status: 400 }
            );
        }

        // Remove songId from the playlist's songs array
        const updatedPlaylist = await prisma.playlist.update({
            where: { id: playlistId },
            data: {
                songs: {
                    set: (await prisma.playlist.findUnique({ where: { id: playlistId }, select: { songs: true } })).songs.filter(id => id !== songId),
                },
            },
        });

        // Optional: Remove playlistId from the song's playlists array
        const updatedSong = await prisma.song.update({
            where: { id: songId },
            data: {
                playlists: {
                    set: (await prisma.song.findUnique({ where: { id: songId }, select: { playlists: true } })).playlists.filter(id => id !== playlistId),
                },
            },
        });

        return NextResponse.json(
            { updatedPlaylist, updatedSong },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
