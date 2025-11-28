import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloud = {
  ready: false
};

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  cloud.ready = true;
  console.log("Cloudinary configured");
} else {
  console.log("Cloudinary not configured (missing env vars). Local upload will be used.");
}

export { cloudinary, cloud };
