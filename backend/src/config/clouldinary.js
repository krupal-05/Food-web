import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOULDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOULDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRATE,
});

// Upload an image to Cloudinary
const uploadCloud = async (localpath) => {
  try {
    if (!localpath) return null;

    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
      folder: "food_delivery",
    });

    // Remove local temp file after successful upload
    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
    }

    return uploadResult;
  } catch (error) {
    // Remove local temp file if upload failed
    if (localpath && fs.existsSync(localpath)) {
      try {
        fs.unlinkSync(localpath);
      } catch (unlinkErr) {
        console.error("Error removing local temp file:", unlinkErr);
      }
    }
    console.error("Failed to upload on Cloudinary:", error.message || error);
    return null;
  }
};

export { uploadCloud };
export default uploadCloud;
