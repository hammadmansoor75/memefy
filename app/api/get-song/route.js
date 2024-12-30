import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";
import { NextResponse } from 'next/server';

export async function POST(req){
    try {
        const {id} = await req.json();

        const song = await prisma.song.findUnique({
            where: {
              id: id,
            },
        });

        return NextResponse.json({ song }, {message : "Song Get"}, {status : 200});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}