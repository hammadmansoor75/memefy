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

const sunoApiKey = process.env.SUNO_API_KEY;

function getRandomNumber() {
    return Math.floor(Math.random() * 20) + 1;
}

export async function POST(req){
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({message : "Unauthorized!"}, {status : 401});
        }

        const { description, genre } = await req.json();

        if(!description || !genre){
            return NextResponse.json({message : "All Fields are required!"}, {status : 400});
        }

        console.log("Description: ", description, " , GENRE: " , genre);

        const options = {
            method: 'POST',
            url: 'https://apibox.erweima.ai/api/v1/generate',
            headers: {
              Authorization: `Bearer ${sunoApiKey}`,
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            data: {
              customMode: false,
              instrumental: false,
              prompt: description,
              style: genre,
              model: 'V3_5',
              callBackUrl: 'https://swift-paths-tell.loca.lt/api/callback-suno'
            }
          };


          const {data} = await axios.request(options);
          console.log(data);

          if(data.code !== 200){
            return NextResponse.json({message : "Something went wrong!"}, {status : 400});
          }

          const songTaskId = data.data.taskId;
          console.log("Song Task Id: ", songTaskId);

          let songReady = false;
          let generatedSong = null;

          while(!songReady){
            const getSongOptions = {
                method: 'GET',
                url: 'https://apibox.erweima.ai/api/v1/generate/record-info',
                params: {taskId: songTaskId},
                headers: {
                  Authorization: `Bearer ${sunoApiKey} `,
                  Accept: 'application/json'
                }
            };

            const getSongResponse = await axios.request(getSongOptions);
            console.log(getSongResponse.data);
            const status = getSongResponse.data.data.status;
            console.log("Status: ", status);
            if(getSongResponse.data.data.status === 'SUCCESS'){
                const songs = getSongResponse.data.data.response.sunoData;
                generatedSong = songs[0];
                songReady = true;
            }else{
                console.log("Song generation in progress. Waiting...");
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
          }


          if(songReady && generatedSong){
            const bucketName = process.env.S3_BUCKET_NAME;
            const fileName = `${generatedSong.id}.mp3`
            try {
                const songDownloadResponse = await axios({
                    url: generatedSong.audioUrl,
                    method: 'GET',
                    responseType: 'stream',
                    timeout : 180000,
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

                const lyrics = generatedSong.prompt;
                const title = generatedSong.title;
                const tags = generatedSong.tags;

                const songInDb = await prisma.song.create({
                    data : {
                        userId : user.id,
                        title : title,
                        tags : tags,
                        lyrics : lyrics,
                        songUploadUrl : fileUrl,
                        songImage : imagePath
                    }
                });

                if(songInDb){
                    return NextResponse.json({ song : songInDb }, {status : 200}, {message : "New Song Generated!"});
                }else{
                    return NextResponse.json({ error: "Song Uploading or DB save Error" }, { status: 500 });
                }


            } catch (error) {
                console.log(error)
                return NextResponse.json({ error: "Song download failed" }, { status: 500 });
            }
          }else{
            return NextResponse.json({ error: "Song generation failed" }, { status: 500 });
          }


    } catch (error) {
        console.error("SONG GENERATION SUNO ERROR: ", error)
        return NextResponse.json({error: "Internal Server Error"}, {status : 500});
    }
}