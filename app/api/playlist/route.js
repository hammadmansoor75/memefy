import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";
import { NextResponse } from 'next/server';

function getRandomNumber() {
    return Math.floor(Math.random() * 20) + 1;
}

export async function POST(req){
    try {
        const user = await currentUser();
        
        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        };

        const {name,description} = await req.json();

        const randomImageNumber = getRandomNumber();
        const image = `/assets/song-images/${randomImageNumber}.jpg`

        const playlist = await prisma.playlist.create({
            data : {
                name : name,
                description : description,
                userId : user.id,
                image : image
            }
        });

        return NextResponse.json({playlist : playlist}, {message : "Playlist Created"}, {status : 500});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req){
    try {
        const user = await currentUser();
        
        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        };

        const playlists = await prisma.playlist.findMany({
            where : {userId : user.id}
        })

        return NextResponse.json({playlists : playlists}, {message : "Playlist Created"}, {status : 500});

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

