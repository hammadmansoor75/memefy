import axios from "axios";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { currentUser } from '@clerk/nextjs/server'
import prisma from "@/prisma/client";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

function getRandomNumber() {
    return Math.floor(Math.random() * 20) + 1;
}

export async function POST(req) {
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        }

         


        const { description, genre, wordCount } = await req.json();

        if(!description || !genre || !wordCount){
            return NextResponse.json({message : "All Fields are required!"}, {status : 400});
        }

        console.log(description, " , " , genre , " , " , wordCount);

        // Request body to generate the song
        const requestBody = {
            prompt: `Generate a song with the description "${description}" and genre "${genre}" and word count "${wordCount}"`,
            lyrics_type: "generate",
            bypass_prompt_optimization: false,
            seed: -1,
            prompt_strength: 0.5,
            clarity_strength: 0.25,
            lyrics_strength: 0.5,
            generation_quality: 0.75,
            negative_prompt: "",
            model_type: "studio32-v1.5",
            config: {
                mode: "regular",
            },
        };

        // Sending the request to generate the song
        const response = await axios.post('https://api.musicapi.ai/api/v1/studio/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer e1834b909e49205793692ec9efda753b', // Replace with your actual token
            },
        });

        console.log("Song Generation Response Data:", response.data);

        const songTaskId = response.data?.data;
        console.log("Song Task Id:", songTaskId);

        // Wait for the song to finish generating (with some delay, or you could poll the status)
        let songReady = false;
        let songPath = null;
        let generatedSong = null;

        while (!songReady) {
            // Request to get song status
            const getSongResponse = await axios.get(`https://api.musicapi.ai/api/v1/studio/task/${songTaskId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer e1834b909e49205793692ec9efda753b', // Replace with your actual token
                },
            });

            console.log("GET SONG RESPONSE:", getSongResponse.data);

            const songs = getSongResponse.data.handledData.data.songs;
            const song1 = songs[0];
            const song2 = songs[1];

            // Check if song generation is finished (status === 'SUCCESS' and 100% progress)
            if (song1.song_path !== '') {
                songReady = true;
                console.log("Song Title: ", song1.title);
                console.log("Song Path: ", song1.song_path);
                console.log("Song Tags: ", song1.tags)
                console.log("Song Lyrics:", song2.lyrics)
                generatedSong = song1;
                songPath = song1.song_path;
            }else if(song2.song_path !== ''){
                songReady = true;
                console.log("Song Title: ", song2.title);
                console.log("Song Path: ", song2.song_path);
                console.log("Song Tags: ", song2.tags)
                console.log("Song Lyrics:", song2.lyrics)
                generatedSong = song2;
                songPath = song2.song_path;
            } else {
                // Optionally, you can add a delay here before retrying
                console.log("Song generation in progress. Waiting...");
                await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 5 seconds before checking again
            }
        }


        // const songPath = "https://cdn.musicapi.ai/storage/v1/object/public/songs/song-ccc25c43-7e3d-48d7-a175-ba1c34ffa490-2";

        // Return the song URL or error if not found
        if (songPath && generatedSong) {
            const bucketName = process.env.S3_BUCKET_NAME;
            const fileName = `${generatedSong.id}.mp3`
            
            try{
                const songDownloadResponse = await axios({
                    url: songPath,
                    method: 'GET',
                    responseType: 'stream',
                });


                console.log('Song downloaded, uploading to S3...');

                const uploadParams = {
                    Bucket: bucketName,
                    Key: `songs/${fileName}`,
                    Body: songDownloadResponse.data,
                    ContentType: 'audio/mpeg',
                    ResponseContentDisposition : 'attachment; filename="audio.mp3"'
                    // ACL: 'public-read', // Optional: Make the file publicly accessible
                };

                const upload = new Upload({
                    client: s3,
                    params: uploadParams,
                });
                await upload.done();

                const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/${fileName}`;
                console.log(`File uploaded successfully to S3: ${fileUrl}`);
                const randomImageNumber = getRandomNumber();
                const imagePath = `/assets/song-images/${randomImageNumber}.jpg`

                const songInDb = await prisma.song.create({
                    data : {
                        userId : user.id,
                        title : generatedSong.title,
                        tags : generatedSong.tags,
                        lyrics : generatedSong.lyrics,
                        songUploadUrl : fileUrl,
                        songImage : imagePath
                    }
                });

                if(songInDb){
                    return NextResponse.json({ song : songInDb }, {status : 200}, {message : "New Song Generated!"});
                }else{
                    return NextResponse.json({ error: "Song Uploading or DB save Error" }, { status: 500 });
                }

                

            }catch(error){
                console.log(error)
                return NextResponse.json({ error: "Song download failed" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Song generation failed" }, { status: 500 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
