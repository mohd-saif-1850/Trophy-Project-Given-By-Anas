import { v2 as cloudinary } from "cloudinary";

type CloudinaryUploadResult =
  | {
      success: true;
      url: string;
      public_id: string;
    }
  | {
      success: false;
      message: string;
    };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder || "uploads",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            resolve({
              success: false,
              message: "Image upload failed!",
            });
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      return { success: true, message: "Image deleted successfully!" };
    }
    return { success: false, message: "Image deletion failed!" };
  } catch {
    return { success: false, message: "Image deletion failed!" };
  }
}

export { cloudinary };
