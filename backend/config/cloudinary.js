import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary storage configuration loaded.');
} else {
  console.warn('Cloudinary credentials missing. Falling back to local disk storage.');
}

/**
 * Uploads a local file to Cloudinary.
 * @param {string} filePath - Absolute or relative path to the local file
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<object>} - Cloudinary upload response containing secure_url
 */
export const uploadToCloudinary = async (filePath, folder = 'firstcry_gallery') => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured.');
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export { isCloudinaryConfigured };
