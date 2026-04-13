import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import multer from "multer";
import { UploadApiResponse } from "cloudinary";
import { AppError } from "./utils";

// multer configuration
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Invalid file type", 400));
    }
  },
});

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload to cloudinary function
export const uploadToCloudinary = (
  buffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "e-commerce-store/products" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new AppError("Failed to upload", 500));
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};
