import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const downloadAndUpload = async () => {
  const songUrl = 'https://cdn.musicapi.ai/storage/v1/object/public/songs/song-ccc25c43-7e3d-48d7-a175-ba1c34ffa490-2';
  const bucketName = process.env.S3_BUCKET_NAME;
  const fileName = 'uploaded-song.mp3'; // Set the desired file name for S3

  try {
    // Step 1: Download the song
    console.log('Downloading song...');
    const response = await axios({
      url: songUrl,
      method: 'GET',
      responseType: 'stream', // Stream the data for efficient handling
    });

    console.log('Song downloaded, uploading to S3...');

    // Step 2: Upload the file to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: `songs/${fileName}`, // Path and name of the file in the S3 bucket
      Body: response.data,
      ContentType: 'audio/mpeg', // Set the MIME type for audio files
      ACL: 'public-read', // Optional: Make the file publicly accessible
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    console.log(`File uploaded successfully to S3: https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/${fileName}`);
  } catch (error) {
    console.error('Error downloading or uploading the file:', error);
  }
};

downloadAndUpload();
