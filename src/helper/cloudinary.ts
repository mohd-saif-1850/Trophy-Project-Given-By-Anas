import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File, folder?: string) {
  const tempDir = "temp"

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: folder || "uploads",
      resource_type: "auto",
    });

    fs.unlinkSync(tempFilePath);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);

    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    return { success: false, message: "Image upload failed!" };
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      return { success: true, message: "Image deleted successfully!" };
    }
    return { success: false, message: "Image deletion failed!" };
  } catch (error: any) {
    console.error("Cloudinary delete error:", error.message);
    return { success: false, message: "Image deletion failed!" };
  }
}

export { cloudinary };
