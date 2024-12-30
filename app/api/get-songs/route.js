import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        }

        const songs = await prisma.song.findMany({
            where : {userId : user.id}
        })

        return NextResponse.json({songs : songs}, {message : "Generated User Songs"}, {status : 200});

    } catch (error) {
        console.error("GET SONGS: ", error);
        return NextResponse.json({error : "Internal Server Error"}, {status:500})
    }
}