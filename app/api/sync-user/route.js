import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(req){
    try{
        const user = await currentUser();

        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        }

        const { id, emailAddresses, firstName, lastName } = user;
        const email = emailAddresses[0]?.emailAddress || '';

        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            // Create the user if they don't exist
            await prisma.user.create({
              data: {
                id,
                email,
                firstName: firstName || '',
                lastName: lastName || '',
                createdAt: new Date(),
              },
            });
        }

        return NextResponse.json({message : "User Synced Successfully"})

    }catch(error){
        console.error("SYNCING USER: ", error);
        return NextResponse.json({message : "Internal Server Error"}, {status:500})
    }
}